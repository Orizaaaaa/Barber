import { Request, Response } from 'express';
import * as reportService from '../services/report.service';
import { successResponse, errorResponse } from '../utils/response';

export async function dashboard(req: Request, res: Response) {
  try {
    const data = await reportService.getDashboardOverview();
    return successResponse(res, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load dashboard';
    return errorResponse(res, message, 400);
  }
}

export async function revenue(req: Request, res: Response) {
  try {
    const dateFrom = new Date((req.query.dateFrom as string) || new Date().toISOString().slice(0, 7) + '-01');
    const dateTo = new Date((req.query.dateTo as string) || new Date().toISOString());
    const data = await reportService.getRevenueReport(dateFrom, dateTo);
    return successResponse(res, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load revenue report';
    return errorResponse(res, message, 400);
  }
}

export async function bookings(req: Request, res: Response) {
  try {
    const dateFrom = new Date((req.query.dateFrom as string) || new Date().toISOString().slice(0, 7) + '-01');
    const dateTo = new Date((req.query.dateTo as string) || new Date().toISOString());
    const data = await reportService.getBookingReport(dateFrom, dateTo);
    return successResponse(res, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load booking report';
    return errorResponse(res, message, 400);
  }
}
