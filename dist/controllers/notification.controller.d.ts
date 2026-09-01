import { Request, Response } from 'express';
export declare const createNotificationValidators: import("express-validator").ValidationChain[];
export declare function createNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listMyNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function markRead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function markAllRead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=notification.controller.d.ts.map