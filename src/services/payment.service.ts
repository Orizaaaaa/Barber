import { prisma } from '../config/prisma';

export async function recordPayment(bookingId: number, data: { amount: number; method: string; transactionId?: string }) {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment) throw new Error('Payment record not found');

  const newPaid = payment.paidAmount + data.amount;
  const status = newPaid >= payment.amount ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'UNPAID';

  return prisma.payment.update({
    where: { bookingId },
    data: {
      paidAmount: newPaid,
      status,
      method: data.method,
      transactionId: data.transactionId || payment.transactionId,
      paidAt: status !== 'UNPAID' ? new Date() : null,
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
