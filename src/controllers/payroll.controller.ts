import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as payrollService from '../services/payroll.service';
import { successResponse, errorResponse } from '../utils/response';

export const createPayrollValidators = [
  body('barberId').isInt({ min: 1 }),
  body('periodStart').isISO8601(),
  body('periodEnd').isISO8601(),
  body('total').isFloat({ min: 0 }),
];

export const generatePayrollValidators = [
  body('barberId').isInt({ min: 1 }),
  body('periodStart').isISO8601(),
  body('periodEnd').isISO8601(),
  body('bonus').optional().isFloat({ min: 0 }),
  body('deductions').optional().isFloat({ min: 0 }),
];

export async function createPayroll(req: Request, res: Response) {
  try {
    const payload = {
      ...req.body,
      periodStart: new Date(req.body.periodStart),
      periodEnd: new Date(req.body.periodEnd),
    };
    const payroll = await payrollService.createPayroll(payload);
    return successResponse(res, payroll, 'Payroll created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create payroll';
    return errorResponse(res, message, 400);
  }
}

export async function generatePayroll(req: Request, res: Response) {
  try {
    const barberId = Number(req.body.barberId);
    const periodStart = new Date(req.body.periodStart);
    const periodEnd = new Date(req.body.periodEnd);
    const bonus = req.body.bonus ? Number(req.body.bonus) : 0;
    const deductions = req.body.deductions ? Number(req.body.deductions) : 0;

    const payroll = await payrollService.generatePayroll(barberId, periodStart, periodEnd, {
      bonus,
      deductions,
    });
    return successResponse(res, payroll, 'Payroll generated', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate payroll';
    return errorResponse(res, message, 400);
  }
}

export async function previewPayroll(req: Request, res: Response) {
  try {
    const barberId = Number(req.params.barberId);
    const periodStart = new Date(req.query.periodStart as string);
    const periodEnd = new Date(req.query.periodEnd as string);
    const bonus = req.query.bonus ? Number(req.query.bonus) : 0;
    const deductions = req.query.deductions ? Number(req.query.deductions) : 0;

    if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
      return errorResponse(res, 'periodStart and periodEnd are required', 400);
    }

    const preview = await payrollService.previewPayroll(barberId, periodStart, periodEnd, {
      bonus,
      deductions,
    });
    return successResponse(res, preview);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to preview payroll';
    return errorResponse(res, message, 400);
  }
}

export async function listPayrolls(req: Request, res: Response) {
  try {
    const barberId = req.query.barberId ? Number(req.query.barberId) : undefined;
    const payrolls = await payrollService.listPayrolls(barberId);
    return successResponse(res, payrolls);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payrolls';
    return errorResponse(res, message, 400);
  }
}

export async function markPaid(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const payroll = await payrollService.markPaid(id);
    return successResponse(res, payroll, 'Payroll marked as paid');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update payroll';
    return errorResponse(res, message, 400);
  }
}

export async function calculateCommission(req: Request, res: Response) {
  try {
    const barberId = Number(req.params.barberId);
    const periodStart = new Date((req.query.periodStart as string) || new Date().toISOString().slice(0, 7) + '-01');
    const periodEnd = new Date((req.query.periodEnd as string) || new Date().toISOString());
    const rate = req.query.rate ? Number(req.query.rate) : undefined;
    const result = await payrollService.calculateCommission(barberId, periodStart, periodEnd, rate);
    return successResponse(res, result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to calculate commission';
    return errorResponse(res, message, 400);
  }
}
