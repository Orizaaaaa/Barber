import { prisma } from '../config/prisma';

export type CompensationType = 'COMMISSION' | 'FIXED' | 'HYBRID';

export interface PayrollPreview {
  barberId: number;
  barberName: string;
  compensationType: CompensationType;
  commissionRate: number;
  periodStart: Date;
  periodEnd: Date;
  bookingCount: number;
  totalRevenue: number;
  baseSalaryPortion: number;
  commission: number;
  bonus: number;
  deductions: number;
  total: number;
}

function daysInclusive(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

/** Gaji pokok bulanan diprorata sesuai jumlah hari periode */
export function prorateMonthlySalary(baseSalary: number, periodStart: Date, periodEnd: Date): number {
  if (baseSalary <= 0) return 0;
  const days = daysInclusive(periodStart, periodEnd);
  const daysInMonth = new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1, 0).getDate();
  return Math.round(baseSalary * (days / daysInMonth));
}

async function getCompletedPaidRevenue(barberId: number, periodStart: Date, periodEnd: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: 'COMPLETED',
      bookingDate: { gte: periodStart, lte: periodEnd },
      payment: { status: 'PAID' },
    },
    include: { payment: true, service: true },
  });

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.payment?.amount ?? b.service.price),
    0
  );

  return { bookings, totalRevenue, bookingCount: bookings.length };
}

export async function previewPayroll(
  barberId: number,
  periodStart: Date,
  periodEnd: Date,
  options?: { bonus?: number; deductions?: number }
): Promise<PayrollPreview> {
  const barber = await prisma.barberProfile.findUnique({
    where: { id: barberId },
    include: { user: { select: { name: true } } },
  });
  if (!barber) throw new Error('Barber not found');

  const type = (barber.compensationType || 'COMMISSION') as CompensationType;
  const rate = barber.commissionRate ?? 0.3;
  const { totalRevenue, bookingCount } = await getCompletedPaidRevenue(barberId, periodStart, periodEnd);

  let baseSalaryPortion = 0;
  let commission = 0;

  if (type === 'FIXED' || type === 'HYBRID') {
    baseSalaryPortion = prorateMonthlySalary(barber.baseSalary, periodStart, periodEnd);
  }
  if (type === 'COMMISSION' || type === 'HYBRID') {
    commission = Math.round(totalRevenue * rate);
  }

  const bonus = options?.bonus ?? 0;
  const deductions = options?.deductions ?? 0;
  const total = Math.max(0, baseSalaryPortion + commission + bonus - deductions);

  return {
    barberId,
    barberName: barber.user.name,
    compensationType: type,
    commissionRate: rate,
    periodStart,
    periodEnd,
    bookingCount,
    totalRevenue,
    baseSalaryPortion,
    commission,
    bonus,
    deductions,
    total,
  };
}

export async function generatePayroll(
  barberId: number,
  periodStart: Date,
  periodEnd: Date,
  options?: { bonus?: number; deductions?: number }
) {
  const existing = await prisma.payroll.findFirst({
    where: {
      barberId,
      periodStart: { lte: periodEnd },
      periodEnd: { gte: periodStart },
    },
  });
  if (existing) {
    throw new Error('Payroll already exists for this barber in the selected period');
  }

  const preview = await previewPayroll(barberId, periodStart, periodEnd, options);

  return prisma.payroll.create({
    data: {
      barberId,
      periodStart,
      periodEnd,
      type: preview.compensationType,
      baseSalary: preview.baseSalaryPortion,
      commission: preview.commission,
      bonus: preview.bonus,
      deductions: preview.deductions,
      total: preview.total,
    },
    include: { barber: { include: { user: { select: { name: true } } } } },
  });
}

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
    include: { barber: { include: { user: { select: { name: true } } } } },
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
    include: { barber: { include: { user: { select: { name: true } } } } },
  });
}

/** @deprecated use previewPayroll */
export async function calculateCommission(
  barberId: number,
  periodStart: Date,
  periodEnd: Date,
  commissionRate?: number
) {
  const barber = await prisma.barberProfile.findUnique({ where: { id: barberId } });
  const rate = commissionRate ?? barber?.commissionRate ?? 0.3;
  const { totalRevenue, bookingCount } = await getCompletedPaidRevenue(barberId, periodStart, periodEnd);
  const commission = Math.round(totalRevenue * rate);
  return { totalRevenue, commission, bookingCount, commissionRate: rate };
}
