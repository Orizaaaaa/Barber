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
exports.createPromoValidators = void 0;
exports.createPromo = createPromo;
exports.listPromos = listPromos;
exports.getPromo = getPromo;
exports.updatePromo = updatePromo;
exports.deletePromo = deletePromo;
exports.validatePromo = validatePromo;
const express_validator_1 = require("express-validator");
const promoService = __importStar(require("../services/promo.service"));
const response_1 = require("../utils/response");
exports.createPromoValidators = [
    (0, express_validator_1.body)('code').notEmpty().trim(),
    (0, express_validator_1.body)('name').notEmpty().trim(),
    (0, express_validator_1.body)('discountType').isIn(['PERCENTAGE', 'FIXED']),
    (0, express_validator_1.body)('discountValue').isFloat({ min: 0 }),
    (0, express_validator_1.body)('startDate').isISO8601(),
    (0, express_validator_1.body)('endDate').isISO8601(),
];
async function createPromo(req, res) {
    try {
        const payload = { ...req.body, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) };
        const promo = await promoService.createPromo(payload);
        return (0, response_1.successResponse)(res, promo, 'Promo created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create promo';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listPromos(req, res) {
    try {
        const activeOnly = req.query.activeOnly === 'true';
        const promos = await promoService.listPromos(activeOnly);
        return (0, response_1.successResponse)(res, promos);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch promos';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getPromo(req, res) {
    try {
        const id = Number(req.params.id);
        const promo = await promoService.getPromoById(id);
        if (!promo)
            return (0, response_1.errorResponse)(res, 'Promo not found', 404);
        return (0, response_1.successResponse)(res, promo);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch promo';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updatePromo(req, res) {
    try {
        const id = Number(req.params.id);
        const promo = await promoService.updatePromo(id, req.body);
        return (0, response_1.successResponse)(res, promo, 'Promo updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update promo';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function deletePromo(req, res) {
    try {
        const id = Number(req.params.id);
        await promoService.deletePromo(id);
        return (0, response_1.successResponse)(res, null, 'Promo deleted');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete promo';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function validatePromo(req, res) {
    try {
        const { code, spend } = req.body;
        const result = await promoService.validatePromo(code, Number(spend));
        return (0, response_1.successResponse)(res, result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid promo';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=promo.controller.js.map