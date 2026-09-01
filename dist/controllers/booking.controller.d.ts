import { Request, Response } from 'express';
export declare const createBookingValidators: import("express-validator").ValidationChain[];
export declare function createBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function reschedule(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function cancel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=booking.controller.d.ts.map