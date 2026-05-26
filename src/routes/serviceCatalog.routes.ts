import { Router } from 'express';
import * as serviceController from '../controllers/serviceCatalog.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), serviceController.createServiceValidators, validate, serviceController.createService);
router.get('/', serviceController.listServices);
router.get('/:id', serviceController.getService);
router.patch('/:id', authenticate, authorize('ADMIN'), serviceController.updateService);
router.delete('/:id', authenticate, authorize('ADMIN'), serviceController.deleteService);

export default router;
