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
exports.generatePayrollValidators = exports.createPayrollValidators = void 0;
exports.createPayroll = createPayroll;
exports.generatePayroll = generatePayroll;
exports.previewPayroll = previewPayroll;
exports.listPayrolls = listPayrolls;
exports.markPaid = markPaid;
exports.calculateCommission = calculateCommission;
const express_validator_1 = require("express-validator");
const payrollService = __importStar(require("../services/payroll.service"));
const response_1 = require("../utils/response");
exports.createPayrollValidators = [
    (0, express_validator_1.body)('barberId').isInt({ min: 1 }),
    (0, express_validator_1.body)('periodStart').isISO8601(),
    (0, express_validator_1.body)('periodEnd').isISO8601(),
    (0, express_validator_1.body)('total').isFloat({ min: 0 }),
];
exports.generatePayrollValidators = [
    (0, express_validator_1.body)('barberId').isInt({ min: 1 }),
    (0, express_validator_1.body)('periodStart').isISO8601(),
    (0, express_validator_1.body)('periodEnd').isISO8601(),
    (0, express_validator_1.body)('bonus').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('deductions').optional().isFloat({ min: 0 }),
];
async function createPayroll(req, res) {
    try {
        const payload = {
            ...req.body,
            periodStart: new Date(req.body.periodStart),
            periodEnd: new Date(req.body.periodEnd),
        };
        const payroll = await payrollService.createPayroll(payload);
        return (0, response_1.successResponse)(res, payroll, 'Payroll created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create payroll';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function generatePayroll(req, res) {
    try {
        const barberId = Number(req.body.barberId);
        const periodStart = new Date(req.body.periodStart);
        const periodEnd = new Date(req.body.periodEnd);
        const bonus = req.body.bonus ? Number(req.body.bonus) : 0;
        const deductions = req.body.deductions ? Number(req.body.deductions) : 0;
        const payroll = await payrollService.generatePayroll(barberId, periodStart, periodEnd, {
            bonus,
            deductions,
        });
        return (0, response_1.successResponse)(res, payroll, 'Payroll generated', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate payroll';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function previewPayroll(req, res) {
    try {
        const barberId = Number(req.params.barberId);
        const periodStart = new Date(req.query.periodStart);
        const periodEnd = new Date(req.query.periodEnd);
        const bonus = req.query.bonus ? Number(req.query.bonus) : 0;
        const deductions = req.query.deductions ? Number(req.query.deductions) : 0;
        if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
            return (0, response_1.errorResponse)(res, 'periodStart and periodEnd are required', 400);
        }
        const preview = await payrollService.previewPayroll(barberId, periodStart, periodEnd, {
            bonus,
            deductions,
        });
        return (0, response_1.successResponse)(res, preview);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to preview payroll';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listPayrolls(req, res) {
    try {
        const barberId = req.query.barberId ? Number(req.query.barberId) : undefined;
        const payrolls = await payrollService.listPayrolls(barberId);
        return (0, response_1.successResponse)(res, payrolls);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch payrolls';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function markPaid(req, res) {
    try {
        const id = Number(req.params.id);
        const payroll = await payrollService.markPaid(id);
        return (0, response_1.successResponse)(res, payroll, 'Payroll marked as paid');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update payroll';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function calculateCommission(req, res) {
    try {
        const barberId = Number(req.params.barberId);
        const periodStart = new Date(req.query.periodStart || new Date().toISOString().slice(0, 7) + '-01');
        const periodEnd = new Date(req.query.periodEnd || new Date().toISOString());
        const rate = req.query.rate ? Number(req.query.rate) : undefined;
        const result = await payrollService.calculateCommission(barberId, periodStart, periodEnd, rate);
        return (0, response_1.successResponse)(res, result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to calculate commission';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=payroll.controller.js.map