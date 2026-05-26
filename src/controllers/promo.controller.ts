import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as promoService from '../services/promo.service';
import { successResponse, errorResponse } from '../utils/response';

export const createPromoValidators = [
  body('code').notEmpty().trim(),
  body('name').notEmpty().trim(),
  body('discountType').isIn(['PERCENTAGE', 'FIXED']),
  body('discountValue').isFloat({ min: 0 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
];

export async function createPromo(req: Request, res: Response) {
  try {
    const payload = { ...req.body, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) };
    const promo = await promoService.createPromo(payload);
    return successResponse(res, promo, 'Promo created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create promo';
    return errorResponse(res, message, 400);
  }
}

export async function listPromos(req: Request, res: Response) {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const promos = await promoService.listPromos(activeOnly);
    return successResponse(res, promos);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch promos';
    return errorResponse(res, message, 400);
  }
}

export async function getPromo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const promo = await promoService.getPromoById(id);
    if (!promo) return errorResponse(res, 'Promo not found', 404);
    return successResponse(res, promo);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch promo';
    return errorResponse(res, message, 400);
  }
}

export async function updatePromo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const promo = await promoService.updatePromo(id, req.body);
    return successResponse(res, promo, 'Promo updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update promo';
    return errorResponse(res, message, 400);
  }
}

export async function deletePromo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await promoService.deletePromo(id);
    return successResponse(res, null, 'Promo deleted');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete promo';
    return errorResponse(res, message, 400);
  }
}

export async function validatePromo(req: Request, res: Response) {
  try {
    const { code, spend } = req.body;
    const result = await promoService.validatePromo(code, Number(spend));
    return successResponse(res, result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid promo';
    return errorResponse(res, message, 400);
  }
}
