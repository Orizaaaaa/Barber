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
exports.getMyData = getMyData;
exports.updateMyData = updateMyData;
exports.getMyPoints = getMyPoints;
exports.listCustomers = listCustomers;
exports.getCustomerBookings = getCustomerBookings;
const customerService = __importStar(require("../services/customer.service"));
const response_1 = require("../utils/response");
async function getMyData(req, res) {
    try {
        const data = await customerService.getCustomerData(req.user.id);
        return (0, response_1.successResponse)(res, data);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateMyData(req, res) {
    try {
        const payload = {};
        if (req.body.preferences)
            payload.preferences = req.body.preferences;
        if (req.body.birthDate)
            payload.birthDate = new Date(req.body.birthDate);
        if (req.body.notes)
            payload.notes = req.body.notes;
        const data = await customerService.updateCustomerData(req.user.id, payload);
        return (0, response_1.successResponse)(res, data, 'Data updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update data';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getMyPoints(req, res) {
    try {
        const data = await customerService.getLoyaltyPoints(req.user.id);
        return (0, response_1.successResponse)(res, data);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch points';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listCustomers(req, res) {
    try {
        const search = req.query.search;
        const customers = await customerService.listCustomers(search);
        return (0, response_1.successResponse)(res, customers);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch customers';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getCustomerBookings(req, res) {
    try {
        const userId = Number(req.params.id);
        const bookings = await customerService.getCustomerBookings(userId);
        return (0, response_1.successResponse)(res, bookings);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=customer.controller.js.map