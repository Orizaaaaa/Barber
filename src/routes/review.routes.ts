import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, reviewController.createReviewValidators, validate, reviewController.createReview);
router.get('/', reviewController.listReviews);
router.get('/:bookingId', reviewController.getReview);

export default router;
