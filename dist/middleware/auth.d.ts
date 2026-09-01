import { Request, Response, NextFunction } from 'express';
export type UserRole = 'CUSTOMER' | 'BARBER' | 'ADMIN';
export declare function authenticate(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function authorize(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map