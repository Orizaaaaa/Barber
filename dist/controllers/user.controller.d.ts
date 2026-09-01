import { Request, Response } from 'express';
export declare const createUserValidators: import("express-validator").ValidationChain[];
export declare function createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map