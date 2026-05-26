import { Router } from 'express';
import * as resourceController from '../controllers/resource.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), resourceController.createResourceValidators, validate, resourceController.createResource);
router.get('/', resourceController.listResources);
router.get('/:id', resourceController.getResource);
router.patch('/:id', authenticate, authorize('ADMIN'), resourceController.updateResource);
router.delete('/:id', authenticate, authorize('ADMIN'), resourceController.deleteResource);

export default router;
