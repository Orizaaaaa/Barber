import { prisma } from '../config/prisma';
import * as bookingService from './booking.service';

export async function recordPayment(
  bookingId: number,
  data: { amount: number; method: string; transactionId?: string; markCompleted?: boolean }
) {
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
    include: { booking: true },
  });
  if (!payment) throw new Error('Payment record not found');
  if (payment.booking.status === 'CANCELLED') {
    throw new Error('Cannot record payment for a cancelled booking');
  }
  if (payment.status === 'PAID') {
    throw new Error('This booking is already fully paid');
  }

  const remaining = payment.amount - payment.paidAmount;
  if (data.amount <= 0) throw new Error('Payment amount must be greater than 0');
  if (data.amount > remaining + 0.01) {
    throw new Error(`Amount exceeds remaining balance (Rp ${Math.round(remaining).toLocaleString('id-ID')})`);
  }

  const newPaid = payment.paidAmount + data.amount;
  const status = newPaid >= payment.amount ? 'PAID' : 'PARTIAL';

  const updatedPayment = await prisma.payment.update({
    where: { bookingId },
    data: {
      paidAmount: newPaid,
      status,
      method: data.method,
      transactionId: data.transactionId || payment.transactionId,
      paidAt: status === 'PAID' ? new Date() : payment.paidAt,
    },
    include: {
      booking: {
        include: {
          service: true,
          customer: { select: { id: true, name: true, phone: true } },
        },
      },
    },
  });

  // Notify customer about payment
  if (updatedPayment.booking.customer?.id) {
    const msg = status === 'PAID'
      ? `Pembayaran untuk ${updatedPayment.booking.service.name} telah lunas. Terima kasih!`
      : `Pembayaran sebagian Rp ${data.amount.toLocaleString('id-ID')} untuk ${updatedPayment.booking.service.name} telah diterima`;
    await prisma.notification.create({
      data: {
        userId: updatedPayment.booking.customer.id,
        title: status === 'PAID' ? 'Pembayaran Lunas' : 'Pembayaran Diterima',
        message: msg,
        channel: 'PUSH',
      },
    });
  }

  const shouldComplete = data.markCompleted !== false && status === 'PAID';
  if (shouldComplete && updatedPayment.booking.status !== 'COMPLETED') {
    if (updatedPayment.booking.status === 'PENDING') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }
    await bookingService.updateBookingStatus(bookingId, 'COMPLETED');
  }

  return prisma.payment.findUnique({
    where: { bookingId },
    include: {
      booking: {
        include: {
          service: true,
          customer: { select: { name: true, phone: true } },
        },
      },
    },
  });
}

export async function getPaymentByBookingId(bookingId: number) {
  return prisma.payment.findUnique({ where: { bookingId } });
}

export async function listPayments() {
  return prisma.payment.findMany({
    include: { booking: { include: { service: true, customer: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}
