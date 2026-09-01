import { Request, Response } from 'express';
export declare const registerValidators: import("express-validator").ValidationChain[];
export declare const loginValidators: import("express-validator").ValidationChain[];
export declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function me(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map