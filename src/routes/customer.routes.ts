import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/me/data', authenticate, customerController.getMyData);
router.patch('/me/data', authenticate, customerController.updateMyData);
router.get('/me/points', authenticate, customerController.getMyPoints);
router.get('/', authenticate, authorize('ADMIN'), customerController.listCustomers);
router.get('/:id/bookings', authenticate, authorize('ADMIN'), customerController.getCustomerBookings);

export default router;
