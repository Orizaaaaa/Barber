import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, authorize('ADMIN'), reportController.dashboard);
router.get('/revenue', authenticate, authorize('ADMIN'), reportController.revenue);
router.get('/bookings', authenticate, authorize('ADMIN'), reportController.bookings);

export default router;
