import { Request, Response } from 'express';
export declare const createItemValidators: import("express-validator").ValidationChain[];
export declare function createItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listItems(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function addStock(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=inventory.controller.d.ts.map