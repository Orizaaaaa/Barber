import { prisma } from '../config/prisma';

export async function createBooking(data: {
  customerId: number;
  barberId: number;
  serviceId: number;
  resourceId?: number;
  bookingDate: Date;
  startTime: string;
  notes?: string;
}) {
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) throw new Error('Service not found');

  // Calculate endTime
  const [h, m] = data.startTime.split(':').map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + service.duration;
  const endH = String(Math.floor(endMin / 60)).padStart(2, '0');
  const endM = String(endMin % 60).padStart(2, '0');
  const endTime = `${endH}:${endM}`;

  // Check barber conflict
  const conflict = await prisma.booking.findFirst({
    where: {
      barberId: data.barberId,
      bookingDate: data.bookingDate,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      OR: [
        { startTime: { lte: data.startTime }, endTime: { gt: data.startTime } },
        { startTime: { lt: endTime }, endTime: { gte: endTime } },
      ],
    },
  });
  if (conflict) throw new Error('Barber is not available at this time');

  // Check resource conflict if provided
  if (data.resourceId) {
    const resourceConflict = await prisma.booking.findFirst({
      where: {
        resourceId: data.resourceId,
        bookingDate: data.bookingDate,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        OR: [
          { startTime: { lte: data.startTime }, endTime: { gt: data.startTime } },
          { startTime: { lt: endTime }, endTime: { gte: endTime } },
        ],
      },
    });
    if (resourceConflict) throw new Error('Resource is not available at this time');
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: data.customerId,
      barberId: data.barberId,
      serviceId: data.serviceId,
      resourceId: data.resourceId,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime,
      status: 'PENDING',
      notes: data.notes,
    },
    include: { service: true, barber: { include: { user: { select: { name: true } } } }, customer: { select: { name: true } } },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: service.price,
      status: 'UNPAID',
    },
  });

  return booking;
}

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

export async function updateBookingStatus(id: number, status: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { service: true, customer: true },
  });

  if (status === 'COMPLETED') {
    // Update customer data
    await prisma.customerData.updateMany({
      where: { userId: booking.customerId },
      data: {
        totalVisits: { increment: 1 },
        totalSpent: { increment: booking.service.price },
        lastVisit: new Date(),
      },
    });

    // Deduct inventory items linked to this service
    const serviceItems = await prisma.inventoryUsage.findMany({ where: { serviceId: booking.serviceId } });
    for (const si of serviceItems) {
      await prisma.inventoryItem.update({
        where: { id: si.itemId },
        data: { quantity: { decrement: si.quantity } },
      });
    }

    // Add loyalty points (1 point per 10000 spent, min 1)
    const points = Math.max(1, Math.floor(booking.service.price / 10000));
    await prisma.loyaltyPoint.create({
      data: {
        userId: booking.customerId,
        points,
        description: `Booking #${booking.id} completed`,
      },
    });
  }

  return booking;
}

export async function rescheduleBooking(id: number, data: { bookingDate?: Date; startTime?: string; barberId?: number; resourceId?: number | null }) {
  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });
  if (!booking) throw new Error('Booking not found');

  let endTime = booking.endTime;
  if (data.startTime) {
    const [h, m] = data.startTime.split(':').map(Number);
    const startMin = h * 60 + m;
    const eMin = startMin + booking.service.duration;
    const endH = String(Math.floor(eMin / 60)).padStart(2, '0');
    const endM = String(eMin % 60).padStart(2, '0');
    endTime = `${endH}:${endM}`;
  }

  return prisma.booking.update({
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

export async function cancelBooking(id: number) {
  return prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}
