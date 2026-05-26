import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';
import { successResponse, errorResponse } from '../utils/response';

export async function getMyData(req: Request, res: Response) {
  try {
    const data = await customerService.getCustomerData(req.user!.id);
    return successResponse(res, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch data';
    return errorResponse(res, message, 400);
  }
}

export async function updateMyData(req: Request, res: Response) {
  try {
    const payload: { preferences?: string; birthDate?: Date; notes?: string } = {};
    if (req.body.preferences) payload.preferences = req.body.preferences;
    if (req.body.birthDate) payload.birthDate = new Date(req.body.birthDate);
    if (req.body.notes) payload.notes = req.body.notes;
    const data = await customerService.updateCustomerData(req.user!.id, payload);
    return successResponse(res, data, 'Data updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update data';
    return errorResponse(res, message, 400);
  }
}

export async function getMyPoints(req: Request, res: Response) {
  try {
    const data = await customerService.getLoyaltyPoints(req.user!.id);
    return successResponse(res, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch points';
    return errorResponse(res, message, 400);
  }
}

export async function listCustomers(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined;
    const customers = await customerService.listCustomers(search);
    return successResponse(res, customers);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch customers';
    return errorResponse(res, message, 400);
  }
}

export async function getCustomerBookings(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const bookings = await customerService.getCustomerBookings(userId);
    return successResponse(res, bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
    return errorResponse(res, message, 400);
  }
}
