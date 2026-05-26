import { Router } from 'express';
import * as promoController from '../controllers/promo.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), promoController.createPromoValidators, validate, promoController.createPromo);
router.get('/', promoController.listPromos);
router.get('/:id', promoController.getPromo);
router.patch('/:id', authenticate, authorize('ADMIN'), promoController.updatePromo);
router.delete('/:id', authenticate, authorize('ADMIN'), promoController.deletePromo);
router.post('/validate', promoController.validatePromo);

export default router;
