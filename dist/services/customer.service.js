"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerData = getCustomerData;
exports.updateCustomerData = updateCustomerData;
exports.getLoyaltyPoints = getLoyaltyPoints;
exports.listCustomers = listCustomers;
exports.getCustomerBookings = getCustomerBookings;
const prisma_1 = require("../config/prisma");
async function getCustomerData(userId) {
    return prisma_1.prisma.customerData.findUnique({
        where: { userId },
        include: { user: { select: { name: true, email: true, phone: true } } },
    });
}
async function updateCustomerData(userId, data) {
    return prisma_1.prisma.customerData.update({
        where: { userId },
        data,
        include: { user: { select: { name: true, email: true, phone: true } } },
    });
}
async function getLoyaltyPoints(userId) {
    const points = await prisma_1.prisma.loyaltyPoint.aggregate({
        where: { userId },
        _sum: { points: true },
    });
    const history = await prisma_1.prisma.loyaltyPoint.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    return { total: points._sum.points || 0, history };
}
async function listCustomers(search) {
    return prisma_1.prisma.user.findMany({
        where: {
            role: 'CUSTOMER',
            ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {}),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            customerData: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function getCustomerBookings(userId) {
    return prisma_1.prisma.booking.findMany({
        where: { customerId: userId },
        include: { service: true, barber: { include: { user: { select: { name: true } } } }, review: true, payment: true },
        orderBy: { bookingDate: 'desc' },
    });
}
//# sourceMappingURL=customer.service.js.map