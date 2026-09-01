"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = updateBookingStatus;
exports.rescheduleBooking = rescheduleBooking;
exports.cancelBooking = cancelBooking;
const prisma_1 = require("../config/prisma");
async function updateBookingStatus(id, status) {
    const existing = await prisma_1.prisma.booking.findUnique({
        where: { id },
        include: { payment: true, service: true, customer: true },
    });
    if (!existing)
        throw new Error('Booking not found');
    if (status === 'COMPLETED' && existing.payment?.status !== 'PAID') {
        throw new Error('Booking cannot be completed until payment is fully paid. Record payment first.');
    }
    if (status === 'CONFIRMED' && !['PENDING'].includes(existing.status)) {
        throw new Error(`Cannot confirm booking with status ${existing.status}`);
    }
    if (status === 'COMPLETED' && existing.status === 'CANCELLED') {
        throw new Error('Cannot complete a cancelled booking');
    }
    const booking = await prisma_1.prisma.booking.update({
        where: { id },
        data: { status },
        include: { service: true, customer: true, payment: true, barber: { include: { user: true } } },
    });
    // Notify customer about status change
    const statusMessages = {
        CONFIRMED: `Reservasi ${booking.service.name} Anda telah dikonfirmasi`,
        COMPLETED: `Reservasi ${booking.service.name} telah selesai. Terima kasih!`,
        CANCELLED: `Reservasi ${booking.service.name} telah dibatalkan`,
        NO_SHOW: `Reservasi ${booking.service.name} ditandai tidak hadir`,
    };
    if (statusMessages[status] && booking.customerId) {
        await prisma_1.prisma.notification.create({
            data: {
                userId: booking.customerId,
                title: `Reservasi ${status === 'CONFIRMED' ? 'Dikonfirmasi' : status === 'COMPLETED' ? 'Selesai' : status === 'CANCELLED' ? 'Dibatalkan' : 'Update'}`,
                message: statusMessages[status],
                channel: 'PUSH',
            },
        });
    }
    // Notify barber when payment is recorded (booking completed)
    if (status === 'COMPLETED' && booking.barber?.userId) {
        await prisma_1.prisma.notification.create({
            data: {
                userId: booking.barber.userId,
                title: 'Booking Selesai',
                message: `Booking ${booking.service.name} telah selesai dan dibayar`,
                channel: 'PUSH',
            },
        });
    }
    if (status === 'COMPLETED') {
        await onBookingCompleted(booking);
    }
    return booking;
}
async function onBookingCompleted(booking) {
    await prisma_1.prisma.customerData.updateMany({
        where: { userId: booking.customerId },
        data: {
            totalVisits: { increment: 1 },
            totalSpent: { increment: booking.service.price },
            lastVisit: new Date(),
        },
    });
    const serviceItems = await prisma_1.prisma.inventoryUsage.findMany({ where: { serviceId: booking.serviceId } });
    for (const si of serviceItems) {
        await prisma_1.prisma.inventoryItem.update({
            where: { id: si.itemId },
            data: { quantity: { decrement: si.quantity } },
        });
    }
    const points = Math.max(1, Math.floor(booking.service.price / 10000));
    await prisma_1.prisma.loyaltyPoint.create({
        data: {
            userId: booking.customerId,
            points,
            description: `Booking #${booking.id} completed`,
        },
    });
}
async function rescheduleBooking(id, data) {
    const booking = await prisma_1.prisma.booking.findUnique({ where: { id }, include: { service: true } });
    if (!booking)
        throw new Error('Booking not found');
    let endTime = booking.endTime;
    if (data.startTime) {
        const [h, m] = data.startTime.split(':').map(Number);
        const eMin = h * 60 + m + booking.service.duration;
        const endH = String(Math.floor(eMin / 60)).padStart(2, '0');
        const endM = String(eMin % 60).padStart(2, '0');
        endTime = `${endH}:${endM}`;
    }
    return prisma_1.prisma.booking.update({
        where: { id },
        data: {
            bookingDate: data.bookingDate,
            startTime: data.startTime,
            endTime,
            barberId: data.barberId,
            resourceId: data.resourceId,
        },
        include: { service: true, barber: { include: { user: { select: { name: true } } } }, customer: { select: { name: true } } },
    });
}
async function cancelBooking(id) {
    return prisma_1.prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
    });
}
//# sourceMappingURL=booking-status.service.js.map