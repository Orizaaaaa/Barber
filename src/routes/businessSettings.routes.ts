import { Router } from 'express';
import * as settingsController from '../controllers/businessSettings.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.get('/', settingsController.getSettings);
router.patch('/', authenticate, authorize('ADMIN'), settingsController.updateSettingsValidators, validate, settingsController.updateSettings);

export default router;
