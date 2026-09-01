import { Request, Response } from 'express';
export declare const recordPaymentValidators: import("express-validator").ValidationChain[];
export declare function recordPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listPayments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map