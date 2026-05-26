import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), userController.createUserValidators, validate, userController.createUser);
router.get('/', authenticate, authorize('ADMIN'), userController.listUsers);
router.get('/:id', authenticate, userController.getUser);
router.patch('/profile', authenticate, userController.updateProfile);

export default router;
