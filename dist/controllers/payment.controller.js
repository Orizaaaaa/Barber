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
exports.recordPaymentValidators = void 0;
exports.recordPayment = recordPayment;
exports.getPayment = getPayment;
exports.listPayments = listPayments;
const express_validator_1 = require("express-validator");
const paymentService = __importStar(require("../services/payment.service"));
const response_1 = require("../utils/response");
exports.recordPaymentValidators = [
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }),
    (0, express_validator_1.body)('method').isIn(['QRIS', 'BANK_TRANSFER', 'CASH', 'WALLET']),
    (0, express_validator_1.body)('markCompleted').optional().isBoolean(),
];
async function recordPayment(req, res) {
    try {
        const bookingId = Number(req.params.bookingId);
        const result = await paymentService.recordPayment(bookingId, req.body);
        return (0, response_1.successResponse)(res, result, 'Payment recorded');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to record payment';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getPayment(req, res) {
    try {
        const bookingId = Number(req.params.bookingId);
        const payment = await paymentService.getPaymentByBookingId(bookingId);
        if (!payment)
            return (0, response_1.errorResponse)(res, 'Payment not found', 404);
        return (0, response_1.successResponse)(res, payment);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch payment';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listPayments(req, res) {
    try {
        const payments = await paymentService.listPayments();
        return (0, response_1.successResponse)(res, payments);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch payments';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=payment.controller.js.map