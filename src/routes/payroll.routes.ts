import { Router } from 'express';
import * as payrollController from '../controllers/payroll.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), payrollController.createPayrollValidators, validate, payrollController.createPayroll);
router.post('/generate', authenticate, authorize('ADMIN'), payrollController.generatePayrollValidators, validate, payrollController.generatePayroll);
router.get('/preview/:barberId', authenticate, authorize('ADMIN'), payrollController.previewPayroll);
router.get('/', authenticate, authorize('ADMIN', 'BARBER'), payrollController.listPayrolls);
router.patch('/:id/paid', authenticate, authorize('ADMIN'), payrollController.markPaid);
router.get('/calculate/:barberId', authenticate, authorize('ADMIN'), payrollController.calculateCommission);

export default router;
