import { Request, Response } from 'express';
export declare const createPayrollValidators: import("express-validator").ValidationChain[];
export declare const generatePayrollValidators: import("express-validator").ValidationChain[];
export declare function createPayroll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function generatePayroll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function previewPayroll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listPayrolls(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function markPaid(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function calculateCommission(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payroll.controller.d.ts.map