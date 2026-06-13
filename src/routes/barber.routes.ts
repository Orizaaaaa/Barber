import { Router } from 'express';
import * as barberController from '../controllers/barber.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), barberController.createBarberValidators, validate, barberController.createBarber);
router.get('/', barberController.listBarbers);
router.get('/random', barberController.getRandomBarber);
router.get('/my-earnings', authenticate, authorize('BARBER'), barberController.getMyEarnings);
router.get('/:id', barberController.getBarber);
router.patch('/:id', authenticate, authorize('ADMIN'), barberController.updateBarber);
router.post('/:id/schedule', authenticate, authorize('ADMIN'), barberController.setSchedule);
router.get('/:id/availability', barberController.getAvailability);
router.post('/:id/portfolio', authenticate, authorize('ADMIN', 'BARBER'), barberController.addPortfolio);
router.delete('/:id/portfolio/:portfolioId', authenticate, authorize('ADMIN', 'BARBER'), barberController.removePortfolio);

export default router;
