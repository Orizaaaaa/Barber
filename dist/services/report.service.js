"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardOverview = getDashboardOverview;
exports.getRevenueReport = getRevenueReport;
exports.getBookingReport = getBookingReport;
const prisma_1 = require("../config/prisma");
async function getDashboardOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [totalBookings, todayBookings, pendingPayments, totalRevenueAgg, totalCustomers, totalBarbers] = await Promise.all([
        prisma_1.prisma.booking.count(),
        prisma_1.prisma.booking.count({ where: { bookingDate: { gte: today, lt: tomorrow } } }),
        prisma_1.prisma.payment.count({ where: { status: 'UNPAID' } }),
        prisma_1.prisma.payment.aggregate({
            where: { status: 'PAID' },
            _sum: { paidAmount: true },
        }),
        prisma_1.prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma_1.prisma.user.count({ where: { role: 'BARBER' } }),
    ]);
    return {
        totalBookings,
        todayBookings,
        pendingPayments,
        totalRevenue: totalRevenueAgg._sum.paidAmount || 0,
        totalCustomers,
        totalBarbers,
    };
}
async function getRevenueReport(dateFrom, dateTo) {
    const payments = await prisma_1.prisma.payment.findMany({
        where: { paidAt: { gte: dateFrom, lte: dateTo }, status: { in: ['PAID', 'PARTIAL'] } },
        include: { booking: { include: { service: true, barber: { include: { user: { select: { name: true } } } } } } },
        orderBy: { paidAt: 'asc' },
    });
    const byService = new Map();
    const byBarber = new Map();
    let total = 0;
    for (const p of payments) {
        total += p.paidAmount;
        const sName = p.booking.service.name;
        byService.set(sName, (byService.get(sName) || 0) + p.paidAmount);
        const bName = p.booking.barber?.user?.name || 'Unknown';
        byBarber.set(bName, (byBarber.get(bName) || 0) + p.paidAmount);
    }
    return { total, byService: Object.fromEntries(byService), byBarber: Object.fromEntries(byBarber), payments };
}
async function getBookingReport(dateFrom, dateTo) {
    const bookings = await prisma_1.prisma.booking.findMany({
        where: { bookingDate: { gte: dateFrom, lte: dateTo } },
        include: { service: true, barber: { include: { user: { select: { name: true } } } } },
    });
    const statusCounts = new Map();
    const byService = new Map();
    const byBarber = new Map();
    for (const b of bookings) {
        statusCounts.set(b.status, (statusCounts.get(b.status) || 0) + 1);
        byService.set(b.service.name, (byService.get(b.service.name) || 0) + 1);
        const bName = b.barber?.user?.name || 'Unknown';
        byBarber.set(bName, (byBarber.get(bName) || 0) + 1);
    }
    return { total: bookings.length, statusCounts: Object.fromEntries(statusCounts), byService: Object.fromEntries(byService), byBarber: Object.fromEntries(byBarber) };
}
//# sourceMappingURL=report.service.js.map