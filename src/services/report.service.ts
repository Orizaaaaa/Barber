import { prisma } from '../config/prisma';

export async function getDashboardOverview() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalBookings, todayBookings, pendingPayments, totalRevenueAgg, totalCustomers, totalBarbers] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { bookingDate: { gte: today, lt: tomorrow } } }),
    prisma.payment.count({ where: { status: 'UNPAID' } }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { paidAmount: true },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'BARBER' } }),
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

export async function getRevenueReport(dateFrom: Date, dateTo: Date) {
  const payments = await prisma.payment.findMany({
    where: { paidAt: { gte: dateFrom, lte: dateTo }, status: { in: ['PAID', 'PARTIAL'] } },
    include: { booking: { include: { service: true, barber: { include: { user: { select: { name: true } } } } } } },
    orderBy: { paidAt: 'asc' },
  });

  const byService = new Map<string, number>();
  const byBarber = new Map<string, number>();
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

export async function getBookingReport(dateFrom: Date, dateTo: Date) {
  const bookings = await prisma.booking.findMany({
    where: { bookingDate: { gte: dateFrom, lte: dateTo } },
    include: { service: true, barber: { include: { user: { select: { name: true } } } } },
  });

  const statusCounts = new Map<string, number>();
  const byService = new Map<string, number>();
  const byBarber = new Map<string, number>();

  for (const b of bookings) {
    statusCounts.set(b.status, (statusCounts.get(b.status) || 0) + 1);
    byService.set(b.service.name, (byService.get(b.service.name) || 0) + 1);
    const bName = b.barber?.user?.name || 'Unknown';
    byBarber.set(bName, (byBarber.get(bName) || 0) + 1);
  }

  return { total: bookings.length, statusCounts: Object.fromEntries(statusCounts), byService: Object.fromEntries(byService), byBarber: Object.fromEntries(byBarber) };
}
