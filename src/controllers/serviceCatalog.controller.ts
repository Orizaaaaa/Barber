import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as serviceCatalog from '../services/serviceCatalog.service';
import { successResponse, errorResponse } from '../utils/response';

export const createServiceValidators = [
  body('name').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('duration').isInt({ min: 5 }),
];

export async function createService(req: Request, res: Response) {
  try {
    const service = await serviceCatalog.createService(req.body);
    return successResponse(res, service, 'Service created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create service';
    return errorResponse(res, message, 400);
  }
}

export async function listServices(req: Request, res: Response) {
  try {
    const activeOnly = req.query.activeOnly !== 'false';
    const services = await serviceCatalog.listServices(activeOnly);
    return successResponse(res, services);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch services';
    return errorResponse(res, message, 400);
  }
}

export async function getService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const service = await serviceCatalog.getServiceById(id);
    if (!service) return errorResponse(res, 'Service not found', 404);
    return successResponse(res, service);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch service';
    return errorResponse(res, message, 400);
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const service = await serviceCatalog.updateService(id, req.body);
    return successResponse(res, service, 'Service updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update service';
    return errorResponse(res, message, 400);
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await serviceCatalog.deleteService(id);
    return successResponse(res, null, 'Service deleted');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete service';
    return errorResponse(res, message, 400);
  }
}
