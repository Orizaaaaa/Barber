"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.getBookingById = getBookingById;
const prisma_1 = require("../config/prisma");
async function listBookings(filters) {
    const where = {};
    if (filters.customerId)
        where.customerId = filters.customerId;
    if (filters.barberId)
        where.barberId = filters.barberId;
    if (filters.status)
        where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
        where.bookingDate = {};
        if (filters.dateFrom)
            where.bookingDate.gte = filters.dateFrom;
        if (filters.dateTo)
            where.bookingDate.lte = filters.dateTo;
    }
    return prisma_1.prisma.booking.findMany({
        where,
        include: {
            service: true,
            barber: { include: { user: { select: { name: true, avatar: true } } } },
            customer: { select: { name: true, phone: true } },
            resource: true,
            payment: true,
            review: true,
        },
        orderBy: { bookingDate: 'desc' },
    });
}
async function getBookingById(id) {
    return prisma_1.prisma.booking.findUnique({
        where: { id },
        include: {
            service: true,
            barber: { include: { user: { select: { name: true, avatar: true } } } },
            customer: { select: { name: true, phone: true } },
            resource: true,
            payment: true,
            review: true,
            inventoryUsages: { include: { item: true } },
        },
    });
}
//# sourceMappingURL=booking-query.service.js.map