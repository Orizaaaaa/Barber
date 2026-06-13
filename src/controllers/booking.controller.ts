import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as bookingService from '../services/booking.service';
import { successResponse, errorResponse } from '../utils/response';

export const createBookingValidators = [
  body('customerName').optional().isString(),
  body('customerPhone').optional().isString(),
  body('barberId').custom((value) => {
    if (value === 'random') return true;
    if (typeof value === 'number' && value >= 1) return true;
    if (typeof value === 'string' && !isNaN(Number(value)) && Number(value) >= 1) return true;
    throw new Error('barberId must be a positive integer or "random"');
  }),
  body('serviceId').isInt({ min: 1 }).toInt(),
  body('date').isISO8601(),
  body('startTime').matches(/^\d{2}:\d{2}$/),
  body('promoCode').optional().isString().toUpperCase(),
];

export async function createBooking(req: Request, res: Response) {
  try {
    const payload: any = {
      ...req.body,
      bookingDate: new Date(req.body.date),
    };

    // If user is authenticated, use customerId from auth
    if (req.user) {
      payload.customerId = req.user.id;
    }

    // Remove date field as we use bookingDate
    delete payload.date;

    const booking = await bookingService.createBooking(payload);
    return successResponse(res, booking, 'Booking created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create booking';
    return errorResponse(res, message, 400);
  }
}

export async function listBookings(req: Request, res: Response) {
  try {
    const filters: Parameters<typeof bookingService.listBookings>[0] = {};
    if (req.query.customerId) filters.customerId = Number(req.query.customerId);
    if (req.query.barberId) filters.barberId = Number(req.query.barberId);
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.dateFrom) filters.dateFrom = new Date(req.query.dateFrom as string);
    if (req.query.dateTo) filters.dateTo = new Date(req.query.dateTo as string);
    const bookings = await bookingService.listBookings(filters);
    return successResponse(res, bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
    return errorResponse(res, message, 400);
  }
}

export async function getBooking(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const booking = await bookingService.getBookingById(id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    return successResponse(res, booking);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch booking';
    return errorResponse(res, message, 400);
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(id, status);
    return successResponse(res, booking, 'Booking status updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update status';
    return errorResponse(res, message, 400);
  }
}

export async function reschedule(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const payload: { bookingDate?: Date; startTime?: string; barberId?: number; resourceId?: number | null } = {};
    if (req.body.bookingDate) payload.bookingDate = new Date(req.body.bookingDate);
    if (req.body.startTime) payload.startTime = req.body.startTime;
    if (req.body.barberId) payload.barberId = Number(req.body.barberId);
    if (req.body.resourceId !== undefined) payload.resourceId = req.body.resourceId === null ? null : Number(req.body.resourceId);
    const booking = await bookingService.rescheduleBooking(id, payload);
    return successResponse(res, booking, 'Booking rescheduled');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reschedule';
    return errorResponse(res, message, 400);
  }
}

export async function cancel(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const booking = await bookingService.cancelBooking(id);
    return successResponse(res, booking, 'Booking cancelled');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to cancel booking';
    return errorResponse(res, message, 400);
  }
}
