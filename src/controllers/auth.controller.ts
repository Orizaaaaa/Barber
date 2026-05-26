import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

export const registerValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
];

export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.registerCustomer(req.body);
    return successResponse(res, result, 'Registered successfully', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return errorResponse(res, message, 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, 'Logged in successfully');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return errorResponse(res, message, 401);
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.id);
    return successResponse(res, user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    return errorResponse(res, message, 400);
  }
}
