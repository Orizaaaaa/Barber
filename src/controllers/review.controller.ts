import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as reviewService from '../services/review.service';
import { successResponse, errorResponse } from '../utils/response';

export const createReviewValidators = [
  body('bookingId').isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
];

export async function createReview(req: Request, res: Response) {
  try {
    const review = await reviewService.createReview(req.body);
    return successResponse(res, review, 'Review created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create review';
    return errorResponse(res, message, 400);
  }
}

export async function listReviews(req: Request, res: Response) {
  try {
    const barberId = req.query.barberId ? Number(req.query.barberId) : undefined;
    const reviews = await reviewService.listReviews(barberId);
    return successResponse(res, reviews);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
    return errorResponse(res, message, 400);
  }
}

export async function getReview(req: Request, res: Response) {
  try {
    const bookingId = Number(req.params.bookingId);
    const review = await reviewService.getReviewByBookingId(bookingId);
    if (!review) return errorResponse(res, 'Review not found', 404);
    return successResponse(res, review);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch review';
    return errorResponse(res, message, 400);
  }
}
