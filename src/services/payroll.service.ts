import { prisma } from '../config/prisma';

export async function createPayroll(data: {
  barberId: number;
  periodStart: Date;
  periodEnd: Date;
  baseSalary?: number;
  commission?: number;
  bonus?: number;
  deductions?: number;
  total: number;
  type?: string;
}) {
  return prisma.payroll.create({
    data: {
      ...data,
      type: data.type || 'COMMISSION',
    },
  });
}

export async function listPayrolls(barberId?: number) {
  return prisma.payroll.findMany({
    where: barberId ? { barberId } : undefined,
    include: { barber: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markPaid(id: number) {
  return prisma.payroll.update({
    where: { id },
    data: { isPaid: true, paidAt: new Date() },
  });
}

export async function calculateCommission(barberId: number, periodStart: Date, periodEnd: Date, commissionRate = 0.4) {
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: 'COMPLETED',
      bookingDate: { gte: periodStart, lte: periodEnd },
    },
    include: { service: true },
  });

  const totalRevenue = bookings.reduce((sum: number, b: { service: { price: number } }) => sum + b.service.price, 0);
  const commission = totalRevenue * commissionRate;

  return {
    totalRevenue,
    commission,
    bookingCount: bookings.length,
  };
}
