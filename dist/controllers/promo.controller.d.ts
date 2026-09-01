import { Request, Response } from 'express';
export declare const createPromoValidators: import("express-validator").ValidationChain[];
export declare function createPromo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listPromos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPromo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updatePromo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deletePromo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function validatePromo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=promo.controller.d.ts.map