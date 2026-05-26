import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

export const createUserValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
  body('role').isIn(['CUSTOMER', 'BARBER', 'ADMIN']),
];

export async function createUser(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, 'User created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user';
    return errorResponse(res, message, 400);
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const role = req.query.role as string | undefined;
    const users = await userService.listUsers(role);
    return successResponse(res, users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users';
    return errorResponse(res, message, 400);
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    return errorResponse(res, message, 400);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const id = req.user!.id;
    const user = await userService.updateUser(id, req.body);
    return successResponse(res, user, 'Profile updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile';
    return errorResponse(res, message, 400);
  }
}
