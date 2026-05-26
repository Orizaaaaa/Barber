import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as settingsService from '../services/businessSettings.service';
import { successResponse, errorResponse } from '../utils/response';

export const updateSettingsValidators = [
  body('shopName').optional().trim(),
  body('openingTime').optional().matches(/^\d{2}:\d{2}$/),
  body('closingTime').optional().matches(/^\d{2}:\d{2}$/),
];

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await settingsService.getSettings();
    return successResponse(res, settings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch settings';
    return errorResponse(res, message, 400);
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const settings = await settingsService.upsertSettings(req.body);
    return successResponse(res, settings, 'Settings updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update settings';
    return errorResponse(res, message, 400);
  }
}
