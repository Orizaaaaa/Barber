import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), paymentController.listPayments);
router.get('/:bookingId', authenticate, paymentController.getPayment);
router.post('/:bookingId', authenticate, authorize('ADMIN'), paymentController.recordPaymentValidators, validate, paymentController.recordPayment);

export default router;
