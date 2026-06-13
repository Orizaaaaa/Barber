import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as resourceService from '../services/resource.service';
import { successResponse, errorResponse } from '../utils/response';

export const createResourceValidators = [
  body('name').notEmpty().trim(),
  body('type').notEmpty().trim(),
];

export async function createResource(req: Request, res: Response) {
  try {
    const resource = await resourceService.createResource(req.body);
    return successResponse(res, resource, 'Resource created', 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create resource';
    return errorResponse(res, message, 400);
  }
}

export async function listResources(req: Request, res: Response) {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const resources = await resourceService.listResources(activeOnly);
    return successResponse(res, resources);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch resources';
    return errorResponse(res, message, 400);
  }
}

export async function getResource(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const resource = await resourceService.getResourceById(id);
    if (!resource) return errorResponse(res, 'Resource not found', 404);
    return successResponse(res, resource);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch resource';
    return errorResponse(res, message, 400);
  }
}

export async function updateResource(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const resource = await resourceService.updateResource(id, req.body);
    return successResponse(res, resource, 'Resource updated');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update resource';
    return errorResponse(res, message, 400);
  }
}

export async function deleteResource(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await resourceService.deleteResource(id);
    return successResponse(res, null, 'Resource deleted');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete resource';
    return errorResponse(res, message, 400);
  }
}
