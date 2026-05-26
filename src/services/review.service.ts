import { prisma } from '../config/prisma';

export async function createReview(data: { bookingId: number; rating: number; comment?: string }) {
  const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'COMPLETED') throw new Error('Only completed bookings can be reviewed');

  return prisma.review.create({
    data,
  });
}

export async function listReviews(barberId?: number) {
  const where: Record<string, unknown> = {};
  if (barberId) {
    where.booking = { barberId };
  }
  return prisma.review.findMany({
    where,
    include: {
      booking: {
        select: {
          customerId: true,
          barberId: true,
          service: { select: { name: true } },
          customer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getReviewByBookingId(bookingId: number) {
  return prisma.review.findUnique({
    where: { bookingId },
    include: {
      booking: {
        select: {
          customerId: true,
          barberId: true,
          service: { select: { name: true } },
          customer: { select: { name: true } },
        },
      },
    },
  });
}
