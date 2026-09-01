import { Request, Response } from 'express';
export declare const createBarberValidators: import("express-validator").ValidationChain[];
export declare function createBarber(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listBarbers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getBarber(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateBarber(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function setSchedule(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getRandomBarber(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMyEarnings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function addPortfolio(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removePortfolio(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=barber.controller.d.ts.map