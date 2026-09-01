"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBarber = createBarber;
exports.listBarbers = listBarbers;
exports.getBarberById = getBarberById;
exports.updateBarber = updateBarber;
exports.upsertSchedule = upsertSchedule;
exports.getRandomBarber = getRandomBarber;
exports.addPortfolio = addPortfolio;
exports.removePortfolio = removePortfolio;
exports.getBarberEarnings = getBarberEarnings;
exports.getBarberAvailability = getBarberAvailability;
const prisma_1 = require("../config/prisma");
async function createBarber(data) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already exists');
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: data.password, // should be hashed before calling this
            name: data.name,
            phone: data.phone,
            role: 'BARBER',
            barberProfile: {
                create: {
                    specialty: data.specialty,
                    experience: data.experience,
                    bio: data.bio,
                    compensationType: data.compensationType || 'COMMISSION',
                    baseSalary: data.baseSalary ?? 0,
                    commissionRate: data.commissionRate ?? 0.3,
                },
            },
        },
        include: { barberProfile: true },
    });
    return user;
}
async function listBarbers(includeInactive = false) {
    return prisma_1.prisma.barberProfile.findMany({
        where: includeInactive ? undefined : { isActive: true },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
            schedules: true,
            _count: { select: { bookings: true, portfolios: true } },
        },
    });
}
async function getBarberById(id) {
    return prisma_1.prisma.barberProfile.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
            schedules: true,
            portfolios: true,
            bookings: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { service: true, customer: { select: { name: true } } },
            },
        },
    });
}
async function updateBarber(id, data) {
    return prisma_1.prisma.barberProfile.update({
        where: { id },
        data,
        include: { user: { select: { id: true, name: true, email: true } } },
    });
}
async function upsertSchedule(barberId, schedules) {
    await prisma_1.prisma.barberSchedule.deleteMany({ where: { barberId } });
    await prisma_1.prisma.barberSchedule.createMany({
        data: schedules.map((s) => ({ ...s, barberId })),
    });
    return prisma_1.prisma.barberSchedule.findMany({ where: { barberId } });
}
/**
 * Get the barber with fewest bookings on a given date (fair round-robin).
 * Ties broken by total bookings overall.
 */
async function getRandomBarber(date) {
    const activeBarbers = await prisma_1.prisma.barberProfile.findMany({
        where: { isActive: true },
        include: {
            user: { select: { id: true, name: true } },
            schedules: true,
            _count: { select: { bookings: true } },
        },
    });
    if (activeBarbers.length === 0)
        return null;
    // Filter barbers who work on this day
    const dayOfWeek = date.getDay();
    const availableBarbers = activeBarbers.filter((b) => {
        const schedule = b.schedules.find((s) => s.dayOfWeek === dayOfWeek);
        return schedule && !schedule.isDayOff;
    });
    if (availableBarbers.length === 0)
        return null;
    // Count bookings per barber for this date
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);
    const bookingCounts = await prisma_1.prisma.booking.groupBy({
        by: ['barberId'],
        where: {
            bookingDate: { gte: dateStart, lte: dateEnd },
            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
            barberId: { in: availableBarbers.map((b) => b.id) },
        },
        _count: { id: true },
    });
    const countMap = new Map();
    for (const bc of bookingCounts) {
        countMap.set(bc.barberId, bc._count.id);
    }
    // Sort by: fewest bookings today, then fewest total bookings (tiebreaker)
    const sorted = availableBarbers.sort((a, b) => {
        const aToday = countMap.get(a.id) || 0;
        const bToday = countMap.get(b.id) || 0;
        if (aToday !== bToday)
            return aToday - bToday;
        return a._count.bookings - b._count.bookings;
    });
    const chosen = sorted[0];
    return { barberId: chosen.id, barberName: chosen.user?.name || 'Unknown' };
}
async function addPortfolio(barberId, imageUrl, caption) {
    return prisma_1.prisma.portfolio.create({
        data: { barberId, imageUrl, caption },
    });
}
async function removePortfolio(id) {
    return prisma_1.prisma.portfolio.delete({ where: { id } });
}
/**
 * Get barber earnings: daily breakdown, unpaid commission, total earnings
 */
async function getBarberEarnings(barberId, userId, period = 'month', dateStr) {
    const barber = await prisma_1.prisma.barberProfile.findUnique({
        where: { id: barberId },
        include: { user: { select: { name: true } } },
    });
    if (!barber)
        throw new Error('Barber not found');
    const commissionRate = barber.commissionRate ?? 0.3;
    const compensationType = barber.compensationType || 'COMMISSION';
    // Calculate date range based on period + optional date
    const refDate = dateStr ? new Date(dateStr) : new Date();
    let periodStart;
    let periodEnd;
    if (period === 'day') {
        periodStart = new Date(refDate);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(refDate);
        periodEnd.setHours(23, 59, 59, 999);
    }
    else if (period === 'week') {
        periodStart = new Date(refDate);
        periodStart.setDate(refDate.getDate() - refDate.getDay()); // Sunday
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6); // Saturday
        periodEnd.setHours(23, 59, 59, 999);
    }
    else {
        periodStart = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);
        periodEnd.setHours(23, 59, 59, 999);
    }
    // Get completed bookings for the period
    const periodBookings = await prisma_1.prisma.booking.findMany({
        where: {
            barberId,
            status: 'COMPLETED',
            bookingDate: { gte: periodStart, lte: periodEnd },
        },
        include: {
            service: true,
            payment: true,
            customer: { select: { name: true } },
        },
        orderBy: { bookingDate: 'desc' },
    });
    // Get all completed bookings (for total unpaid - not filtered by period)
    const allCompletedBookings = await prisma_1.prisma.booking.findMany({
        where: {
            barberId,
            status: 'COMPLETED',
        },
        include: {
            service: true,
            payment: true,
        },
    });
    // Get paid payrolls to determine what has been paid out
    const paidPayrolls = await prisma_1.prisma.payroll.findMany({
        where: {
            barberId,
            isPaid: true,
        },
    });
    // Calculate total paid amount (from payrolls)
    const totalPaidOut = paidPayrolls.reduce((sum, p) => sum + p.total, 0);
    // Unpaid = all completed bookings revenue - what's been paid via payroll
    const totalRevenue = allCompletedBookings.reduce((sum, b) => sum + (b.payment?.finalAmount ?? b.service.price), 0);
    const totalCommission = compensationType === 'FIXED' ? 0 : Math.round(totalRevenue * commissionRate);
    const unpaidCommission = Math.max(0, totalCommission - totalPaidOut);
    const unpaidRevenue = compensationType === 'FIXED' ? 0 : Math.round(unpaidCommission / commissionRate);
    // Period stats
    const periodRevenue = periodBookings.reduce((sum, b) => sum + (b.payment?.finalAmount ?? b.service.price), 0);
    const periodCommission = compensationType === 'FIXED' ? 0 : Math.round(periodRevenue * commissionRate);
    // Group by day
    const dailyMap = new Map();
    for (const booking of periodBookings) {
        const dateKey = booking.bookingDate.toISOString().split('T')[0];
        const existing = dailyMap.get(dateKey) || { revenue: 0, count: 0, commission: 0, bookings: [] };
        const amount = booking.payment?.finalAmount ?? booking.service.price;
        existing.revenue += amount;
        existing.count += 1;
        existing.commission += compensationType === 'FIXED' ? 0 : Math.round(amount * commissionRate);
        existing.bookings.push(booking);
        dailyMap.set(dateKey, existing);
    }
    const dailyBreakdown = Array.from(dailyMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        count: data.count,
        commission: data.commission,
        bookings: data.bookings.map(b => ({
            id: b.id,
            service: b.service.name,
            customer: b.customer?.name || 'Walk-in',
            amount: b.payment?.finalAmount ?? b.service.price,
            time: b.startTime,
        })),
    }));
    return {
        barberId,
        barberName: barber.user?.name || 'Unknown',
        compensationType,
        commissionRate,
        period,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        periodStats: {
            revenue: periodRevenue,
            commission: periodCommission,
            bookingCount: periodBookings.length,
        },
        unpaid: {
            revenue: unpaidRevenue,
            commission: unpaidCommission,
            bookingCount: unpaidCommission > 0 ? Math.ceil(unpaidCommission / (commissionRate * 10000)) : 0,
        },
        paidOut: {
            total: totalPaidOut,
            payrollCount: paidPayrolls.length,
        },
        dailyBreakdown,
    };
}
async function getBarberAvailability(barberId, date) {
    const dayOfWeek = date.getDay();
    const schedule = await prisma_1.prisma.barberSchedule.findUnique({
        where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
    });
    if (!schedule || schedule.isDayOff)
        return { available: false, slots: [] };
    const bookings = await prisma_1.prisma.booking.findMany({
        where: {
            barberId,
            bookingDate: date,
            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
        select: { startTime: true, endTime: true },
    });
    // Read business settings to clip to operating hours
    const settings = await prisma_1.prisma.businessSettings.findFirst();
    const shopOpen = settings?.openingTime || '09:00';
    const shopClose = settings?.closingTime || '21:00';
    const slotDuration = settings?.slotDuration || 30;
    // Effective start = max(barber schedule start, shop open)
    const [schSh, schSm] = schedule.startTime.split(':').map(Number);
    const [shopOh, shopOm] = shopOpen.split(':').map(Number);
    const [shopCh, shopCm] = shopClose.split(':').map(Number);
    const schStartMin = schSh * 60 + schSm;
    const shopStartMin = shopOh * 60 + shopOm;
    const shopEndMin = shopCh * 60 + shopCm;
    const startMin = Math.max(schStartMin, shopStartMin);
    // Effective end = min(barber schedule end, shop close)
    const [schEh, schEm] = schedule.endTime.split(':').map(Number);
    const schEndMin = schEh * 60 + schEm;
    const endMin = Math.min(schEndMin, shopEndMin);
    // Filter out past slots if date is today
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const currentMin = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
    const slots = [];
    for (let m = startMin; m < endMin; m += slotDuration) {
        // Skip past slots (with 30min buffer)
        if (isToday && m <= currentMin + 30)
            continue;
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        const time = `${hh}:${mm}`;
        const busy = bookings.some((b) => {
            const [bsh, bsm_min] = b.startTime.split(':').map(Number);
            const [beh, bem_min] = b.endTime.split(':').map(Number);
            const bsm = bsh * 60 + bsm_min;
            const bem = beh * 60 + bem_min;
            const tm = m;
            return tm >= bsm && tm < bem;
        });
        if (!busy)
            slots.push(time);
    }
    return { available: true, schedule, slots };
}
//# sourceMappingURL=barber.service.js.map