import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), notificationController.createNotificationValidators, validate, notificationController.createNotification);
router.get('/', authenticate, notificationController.listMyNotifications);
router.patch('/:id/read', authenticate, notificationController.markRead);
router.patch('/read-all', authenticate, notificationController.markAllRead);

export default router;
