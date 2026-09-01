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
exports.dashboard = dashboard;
exports.revenue = revenue;
exports.bookings = bookings;
const reportService = __importStar(require("../services/report.service"));
const response_1 = require("../utils/response");
async function dashboard(req, res) {
    try {
        const data = await reportService.getDashboardOverview();
        return (0, response_1.successResponse)(res, data);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function revenue(req, res) {
    try {
        const dateFrom = new Date(req.query.dateFrom || new Date().toISOString().slice(0, 7) + '-01');
        const dateTo = new Date(req.query.dateTo || new Date().toISOString());
        const data = await reportService.getRevenueReport(dateFrom, dateTo);
        return (0, response_1.successResponse)(res, data);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load revenue report';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function bookings(req, res) {
    try {
        const dateFrom = new Date(req.query.dateFrom || new Date().toISOString().slice(0, 7) + '-01');
        const dateTo = new Date(req.query.dateTo || new Date().toISOString());
        const data = await reportService.getBookingReport(dateFrom, dateTo);
        return (0, response_1.successResponse)(res, data);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load booking report';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=report.controller.js.map