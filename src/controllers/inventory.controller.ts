import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as inventoryService from '../services/inventory.service';
import { successResponse, errorResponse } from '../utils/response';

export const createItemValidators = [
  body('name').notEmpty().trim(),
  body('quantity').isFloat({ min: 0 }),
];

export async function createItem(req: Request, res: Response) {
  try {
    const item = await inventoryService.createItem(req.body);
    return successResponse(res, item, 'Item created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create item';
    return errorResponse(res, message, 400);
  }
}

export async function listItems(req: Request, res: Response) {
  try {
    const lowStock = req.query.lowStock === 'true';
    const items = await inventoryService.listItems(lowStock);
    return successResponse(res, items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch items';
    return errorResponse(res, message, 400);
  }
}

export async function getItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const item = await inventoryService.getItemById(id);
    if (!item) return errorResponse(res, 'Item not found', 404);
    return successResponse(res, item);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch item';
    return errorResponse(res, message, 400);
  }
}

export async function updateItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const item = await inventoryService.updateItem(id, req.body);
    return successResponse(res, item, 'Item updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update item';
    return errorResponse(res, message, 400);
  }
}

export async function deleteItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await inventoryService.deleteItem(id);
    return successResponse(res, null, 'Item deleted');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete item';
    return errorResponse(res, message, 400);
  }
}

export async function addStock(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const amount = Number(req.body.amount);
    const item = await inventoryService.addStock(id, amount);
    return successResponse(res, item, 'Stock added');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add stock';
    return errorResponse(res, message, 400);
  }
}
