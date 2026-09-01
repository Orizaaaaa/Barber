import { Request, Response } from 'express';
export declare const createServiceValidators: import("express-validator").ValidationChain[];
export declare function createService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listServices(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=serviceCatalog.controller.d.ts.map