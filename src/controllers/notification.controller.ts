import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as notificationService from '../services/notification.service';
import { successResponse, errorResponse } from '../utils/response';

export const createNotificationValidators = [
  body('userId').isInt({ min: 1 }),
  body('title').notEmpty().trim(),
  body('message').notEmpty().trim(),
];

export async function createNotification(req: Request, res: Response) {
  try {
    const notification = await notificationService.createNotification(req.body);
    return successResponse(res, notification, 'Notification created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create notification';
    return errorResponse(res, message, 400);
  }
}

export async function listMyNotifications(req: Request, res: Response) {
  try {
    const notifications = await notificationService.listNotifications(req.user!.id);
    return successResponse(res, notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
    return errorResponse(res, message, 400);
  }
}

export async function markRead(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const notification = await notificationService.markRead(id);
    return successResponse(res, notification, 'Marked as read');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark read';
    return errorResponse(res, message, 400);
  }
}

export async function markAllRead(req: Request, res: Response) {
  try {
    await notificationService.markAllRead(req.user!.id);
    return successResponse(res, null, 'All notifications marked as read');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark all read';
    return errorResponse(res, message, 400);
  }
}
