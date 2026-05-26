import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), inventoryController.createItemValidators, validate, inventoryController.createItem);
router.get('/', authenticate, authorize('ADMIN'), inventoryController.listItems);
router.get('/:id', authenticate, authorize('ADMIN'), inventoryController.getItem);
router.patch('/:id', authenticate, authorize('ADMIN'), inventoryController.updateItem);
router.delete('/:id', authenticate, authorize('ADMIN'), inventoryController.deleteItem);
router.post('/:id/stock', authenticate, authorize('ADMIN'), inventoryController.addStock);

export default router;
