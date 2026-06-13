import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as paymentService from '../services/payment.service';
import { successResponse, errorResponse } from '../utils/response';

export const recordPaymentValidators = [
  body('amount').isFloat({ min: 0 }),
  body('method').isIn(['QRIS', 'BANK_TRANSFER', 'CASH', 'WALLET']),
  body('markCompleted').optional().isBoolean(),
];

export async function recordPayment(req: Request, res: Response) {
  try {
    const bookingId = Number(req.params.bookingId);
    const result = await paymentService.recordPayment(bookingId, req.body);
    return successResponse(res, result, 'Payment recorded');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to record payment';
    return errorResponse(res, message, 400);
  }
}

export async function getPayment(req: Request, res: Response) {
  try {
    const bookingId = Number(req.params.bookingId);
    const payment = await paymentService.getPaymentByBookingId(bookingId);
    if (!payment) return errorResponse(res, 'Payment not found', 404);
    return successResponse(res, payment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payment';
    return errorResponse(res, message, 400);
  }
}

export async function listPayments(req: Request, res: Response) {
  try {
    const payments = await paymentService.listPayments();
    return successResponse(res, payments);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payments';
    return errorResponse(res, message, 400);
  }
}
