import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as barberService from '../services/barber.service';
import { hashPassword } from '../utils/password';
import { successResponse, errorResponse } from '../utils/response';

export const createBarberValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
];

export async function createBarber(req: Request, res: Response) {
  try {
    const payload = { ...req.body, password: await hashPassword(req.body.password) };
    const barber = await barberService.createBarber(payload);
    return successResponse(res, barber, 'Barber created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create barber';
    return errorResponse(res, message, 400);
  }
}

export async function listBarbers(req: Request, res: Response) {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const barbers = await barberService.listBarbers(includeInactive);
    return successResponse(res, barbers);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch barbers';
    return errorResponse(res, message, 400);
  }
}

export async function getBarber(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const barber = await barberService.getBarberById(id);
    if (!barber) return errorResponse(res, 'Barber not found', 404);
    return successResponse(res, barber);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch barber';
    return errorResponse(res, message, 400);
  }
}

export async function updateBarber(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const barber = await barberService.updateBarber(id, req.body);
    return successResponse(res, barber, 'Barber updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update barber';
    return errorResponse(res, message, 400);
  }
}

export async function setSchedule(req: Request, res: Response) {
  try {
    const barberId = Number(req.params.id);
    const schedules = req.body.schedules;
    const result = await barberService.upsertSchedule(barberId, schedules);
    return successResponse(res, result, 'Schedule updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update schedule';
    return errorResponse(res, message, 400);
  }
}

export async function getAvailability(req: Request, res: Response) {
  try {
    const barberId = Number(req.params.id);
    const dateStr = req.query.date as string;
    const date = dateStr ? new Date(dateStr) : new Date();
    const result = await barberService.getBarberAvailability(barberId, date);
    return successResponse(res, result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch availability';
    return errorResponse(res, message, 400);
  }
}

export async function addPortfolio(req: Request, res: Response) {
  try {
    const barberId = Number(req.params.id);
    const { imageUrl, caption } = req.body;
    const portfolio = await barberService.addPortfolio(barberId, imageUrl, caption);
    return successResponse(res, portfolio, 'Portfolio added', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add portfolio';
    return errorResponse(res, message, 400);
  }
}

export async function removePortfolio(req: Request, res: Response) {
  try {
    const id = Number(req.params.portfolioId);
    await barberService.removePortfolio(id);
    return successResponse(res, null, 'Portfolio removed');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to remove portfolio';
    return errorResponse(res, message, 400);
  }
}
