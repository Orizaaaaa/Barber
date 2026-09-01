"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
const prisma_1 = require("../config/prisma");
function calculateEndTime(startTime, durationMinutes) {
    const [h, m] = startTime.split(':').map(Number);
    const endMin = h * 60 + m + durationMinutes;
    const endH = String(Math.floor(endMin / 60)).padStart(2, '0');
    const endM = String(endMin % 60).padStart(2, '0');
    return `${endH}:${endM}`;
}
async function findOrCreateWalkInCustomer(name, phone) {
    let customer = await prisma_1.prisma.user.findFirst({ where: { phone } });
    if (!customer) {
        customer = await prisma_1.prisma.user.create({
            data: {
                name,
                phone,
                email: `${phone}@temp.com`,
                role: 'CUSTOMER',
                password: 'default_password_123',
            },
        });
    }
    return customer.id;
}
async function checkTimeConflict(barberId, bookingDate, startTime, endTime, resourceId) {
    const barberConflict = await prisma_1.prisma.booking.findFirst({
        where: {
            barberId,
            bookingDate,
            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } },
                { startTime: { lt: endTime }, endTime: { gte: endTime } },
            ],
        },
    });
    if (barberConflict)
        throw new Error('Barber is not available at this time');
    if (resourceId) {
        const resourceConflict = await prisma_1.prisma.booking.findFirst({
            where: {
                resourceId,
                bookingDate,
                status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                OR: [
                    { startTime: { lte: startTime }, endTime: { gt: startTime } },
                    { startTime: { lt: endTime }, endTime: { gte: endTime } },
                ],
            },
        });
        if (resourceConflict)
            throw new Error('Resource is not available at this time');
    }
}
async function validateAndCalculateDiscount(promoCode, servicePrice) {
    const promo = await prisma_1.prisma.promo.findUnique({ where: { code: promoCode } });
    if (!promo)
        throw new Error('Promo not found');
    if (!promo.isActive)
        throw new Error('Promo is inactive');
    if (new Date() < promo.startDate)
        throw new Error('Promo not started yet');
    if (new Date() > promo.endDate)
        throw new Error('Promo expired');
    if (promo.maxUses && promo.usedCount >= promo.maxUses)
        throw new Error('Promo usage limit reached');
    if (promo.minSpend && servicePrice < promo.minSpend) {
        throw new Error(`Minimum spend Rp ${promo.minSpend.toLocaleString()} required`);
    }
    let discountAmount = promo.discountType === 'PERCENTAGE'
        ? servicePrice * (promo.discountValue / 100)
        : promo.discountValue;
    discountAmount = Math.min(discountAmount, servicePrice);
    return { promo, discountAmount };
}
async function createBooking(data) {
    const service = await prisma_1.prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service)
        throw new Error('Service not found');
    // Validate booking constraints from business settings
    const settings = await prisma_1.prisma.businessSettings.findFirst();
    const now = new Date();
    // Check max advance days
    const maxDays = settings?.allowBookingDays || 7;
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + maxDays);
    maxDate.setHours(23, 59, 59, 999);
    if (data.bookingDate > maxDate) {
        throw new Error(`Booking cannot be more than ${maxDays} days in advance`);
    }
    // Check min advance hours (booking must be at least 1 hour from now)
    const bookingDateTime = new Date(data.bookingDate);
    const [bh, bm] = data.startTime.split(':').map(Number);
    bookingDateTime.setHours(bh, bm, 0, 0);
    const minAdvanceMs = 60 * 60 * 1000; // 1 hour
    if (bookingDateTime.getTime() - now.getTime() < minAdvanceMs) {
        throw new Error('Booking must be at least 1 hour in advance');
    }
    // Check operating hours
    const shopOpen = settings?.openingTime || '09:00';
    const shopClose = settings?.closingTime || '21:00';
    const [oh, om] = shopOpen.split(':').map(Number);
    const [ch, cm] = shopClose.split(':').map(Number);
    const openMin = oh * 60 + om;
    const closeMin = ch * 60 + cm;
    const bookingMin = bh * 60 + bm;
    const endMin = bookingMin + service.duration;
    if (bookingMin < openMin || endMin > closeMin) {
        throw new Error(`Booking must be within operating hours (${shopOpen} - ${shopClose})`);
    }
    // Resolve barber: random assignment or specific selection
    const isRandom = data.barberId === 'random';
    let finalBarberId;
    let barberSelectionFee = 0;
    if (isRandom) {
        const { getRandomBarber } = await Promise.resolve().then(() => __importStar(require('./barber.service')));
        const randomBarber = await getRandomBarber(data.bookingDate);
        if (!randomBarber)
            throw new Error('No available barbers for this date');
        finalBarberId = randomBarber.barberId;
        // No fee for random selection
    }
    else {
        finalBarberId = Number(data.barberId);
        barberSelectionFee = settings?.barberSelectionFee || 10000;
    }
    let finalCustomerId = data.customerId;
    if (!finalCustomerId && data.customerName && data.customerPhone) {
        finalCustomerId = await findOrCreateWalkInCustomer(data.customerName, data.customerPhone);
    }
    if (!finalCustomerId)
        throw new Error('Customer information is required');
    const endTime = calculateEndTime(data.startTime, service.duration);
    await checkTimeConflict(finalBarberId, data.bookingDate, data.startTime, endTime, data.resourceId);
    let discountAmount = 0;
    let validatedPromo = null;
    if (data.promoCode) {
        try {
            const result = await validateAndCalculateDiscount(data.promoCode, service.price);
            discountAmount = result.discountAmount;
            validatedPromo = result.promo;
        }
        catch (error) {
            throw new Error(`Invalid promo code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    const booking = await prisma_1.prisma.booking.create({
        data: {
            customerId: finalCustomerId,
            barberId: finalBarberId,
            serviceId: data.serviceId,
            resourceId: data.resourceId,
            bookingDate: data.bookingDate,
            startTime: data.startTime,
            endTime,
            status: 'PENDING',
            notes: data.notes,
        },
        include: {
            service: true,
            barber: { include: { user: { select: { name: true } } } },
            customer: { select: { name: true, phone: true } },
            payment: true,
        },
    });
    const finalAmount = service.price + barberSelectionFee - discountAmount;
    await prisma_1.prisma.payment.create({
        data: {
            bookingId: booking.id,
            amount: service.price,
            barberSelectionFee,
            discountAmount,
            promoCode: data.promoCode,
            finalAmount,
            status: 'UNPAID',
        },
    });
    if (validatedPromo) {
        await prisma_1.prisma.promo.update({
            where: { id: validatedPromo.id },
            data: { usedCount: { increment: 1 } },
        });
    }
    // Notify barber about new booking
    const barberProfile = await prisma_1.prisma.barberProfile.findUnique({
        where: { id: finalBarberId },
        select: { userId: true },
    });
    if (barberProfile) {
        const dateStr = data.bookingDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
        await prisma_1.prisma.notification.create({
            data: {
                userId: barberProfile.userId,
                title: 'Booking Baru',
                message: `${booking.customer?.name || 'Pelanggan'} memesan ${service.name} pada ${dateStr} pukul ${data.startTime}`,
                channel: 'PUSH',
            },
        });
    }
    // Notify customer if they have an account
    if (finalCustomerId) {
        const dateStr = data.bookingDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
        await prisma_1.prisma.notification.create({
            data: {
                userId: finalCustomerId,
                title: 'Reservasi Berhasil',
                message: `Reservasi ${service.name} pada ${dateStr} pukul ${data.startTime} sedang menunggu konfirmasi`,
                channel: 'PUSH',
            },
        });
    }
    const { getBookingById } = await Promise.resolve().then(() => __importStar(require('./booking-query.service')));
    return getBookingById(booking.id);
}
//# sourceMappingURL=booking-create.service.js.map