"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItemValidators = void 0;
exports.createItem = createItem;
exports.listItems = listItems;
exports.getItem = getItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.addStock = addStock;
const express_validator_1 = require("express-validator");
const inventoryService = __importStar(require("../services/inventory.service"));
const response_1 = require("../utils/response");
exports.createItemValidators = [
    (0, express_validator_1.body)('name').notEmpty().trim(),
    (0, express_validator_1.body)('quantity').isFloat({ min: 0 }),
];
async function createItem(req, res) {
    try {
        const item = await inventoryService.createItem(req.body);
        return (0, response_1.successResponse)(res, item, 'Item created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create item';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listItems(req, res) {
    try {
        const lowStock = req.query.lowStock === 'true';
        const items = await inventoryService.listItems(lowStock);
        return (0, response_1.successResponse)(res, items);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch items';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getItem(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await inventoryService.getItemById(id);
        if (!item)
            return (0, response_1.errorResponse)(res, 'Item not found', 404);
        return (0, response_1.successResponse)(res, item);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch item';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateItem(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await inventoryService.updateItem(id, req.body);
        return (0, response_1.successResponse)(res, item, 'Item updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function deleteItem(req, res) {
    try {
        const id = Number(req.params.id);
        await inventoryService.deleteItem(id);
        return (0, response_1.successResponse)(res, null, 'Item deleted');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete item';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function addStock(req, res) {
    try {
        const id = Number(req.params.id);
        const amount = Number(req.body.amount);
        const item = await inventoryService.addStock(id, amount);
        return (0, response_1.successResponse)(res, item, 'Stock added');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add stock';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=inventory.controller.js.map