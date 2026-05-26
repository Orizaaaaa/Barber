import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('CUSTOMER', 'ADMIN'), bookingController.createBookingValidators, validate, bookingController.createBooking);
router.get('/', authenticate, bookingController.listBookings);
router.get('/:id', authenticate, bookingController.getBooking);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'BARBER'), bookingController.updateStatus);
router.patch('/:id/reschedule', authenticate, authorize('ADMIN', 'BARBER', 'CUSTOMER'), bookingController.reschedule);
router.patch('/:id/cancel', authenticate, authorize('ADMIN', 'CUSTOMER'), bookingController.cancel);

export default router;
