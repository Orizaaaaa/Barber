import { prisma } from '../config/prisma';

export async function listBookings(filters: {
  customerId?: number;
  barberId?: number;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const where: Record<string, unknown> = {};
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.barberId) where.barberId = filters.barberId;
  if (filters.status) where.status = filters.status;
  if (filters.dateFrom || filters.dateTo) {
    where.bookingDate = {};
    if (filters.dateFrom) (where.bookingDate as Record<string, unknown>).gte = filters.dateFrom;
    if (filters.dateTo) (where.bookingDate as Record<string, unknown>).lte = filters.dateTo;
  }

  return prisma.booking.findMany({
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

export async function getBookingById(id: number) {
  return prisma.booking.findUnique({
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
