import { Request, Response } from 'express';
export declare const createResourceValidators: import("express-validator").ValidationChain[];
export declare function createResource(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listResources(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getResource(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateResource(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteResource(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=resource.controller.d.ts.map