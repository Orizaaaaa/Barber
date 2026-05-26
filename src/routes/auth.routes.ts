import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authController.registerValidators, validate, authController.register);
router.post('/login', authController.loginValidators, validate, authController.login);
router.get('/me', authenticate, authController.me);

export default router;
