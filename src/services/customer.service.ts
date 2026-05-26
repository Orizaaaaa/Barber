import { prisma } from '../config/prisma';

export async function getCustomerData(userId: number) {
  return prisma.customerData.findUnique({
    where: { userId },
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
}

export async function updateCustomerData(userId: number, data: Partial<{ preferences: string; birthDate?: Date; notes: string }>) {
  return prisma.customerData.update({
    where: { userId },
    data,
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
}

export async function getLoyaltyPoints(userId: number) {
  const points = await prisma.loyaltyPoint.aggregate({
    where: { userId },
    _sum: { points: true },
  });
  const history = await prisma.loyaltyPoint.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return { total: points._sum.points || 0, history };
}

export async function listCustomers(search?: string) {
  return prisma.user.findMany({
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

export async function getCustomerBookings(userId: number) {
  return prisma.booking.findMany({
    where: { customerId: userId },
    include: { service: true, barber: { include: { user: { select: { name: true } } } }, review: true, payment: true },
    orderBy: { bookingDate: 'desc' },
  });
}
