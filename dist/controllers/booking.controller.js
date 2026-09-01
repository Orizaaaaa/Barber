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
exports.createBookingValidators = void 0;
exports.createBooking = createBooking;
exports.listBookings = listBookings;
exports.getBooking = getBooking;
exports.updateStatus = updateStatus;
exports.reschedule = reschedule;
exports.cancel = cancel;
const express_validator_1 = require("express-validator");
const bookingService = __importStar(require("../services/booking.service"));
const response_1 = require("../utils/response");
exports.createBookingValidators = [
    (0, express_validator_1.body)('customerName').optional().isString(),
    (0, express_validator_1.body)('customerPhone').optional().isString(),
    (0, express_validator_1.body)('barberId').custom((value) => {
        if (value === 'random')
            return true;
        if (typeof value === 'number' && value >= 1)
            return true;
        if (typeof value === 'string' && !isNaN(Number(value)) && Number(value) >= 1)
            return true;
        throw new Error('barberId must be a positive integer or "random"');
    }),
    (0, express_validator_1.body)('serviceId').isInt({ min: 1 }).toInt(),
    (0, express_validator_1.body)('date').isISO8601(),
    (0, express_validator_1.body)('startTime').matches(/^\d{2}:\d{2}$/),
    (0, express_validator_1.body)('promoCode').optional().isString().toUpperCase(),
];
async function createBooking(req, res) {
    try {
        const payload = {
            ...req.body,
            bookingDate: new Date(req.body.date),
        };
        // If user is authenticated, use customerId from auth
        if (req.user) {
            payload.customerId = req.user.id;
        }
        // Remove date field as we use bookingDate
        delete payload.date;
        const booking = await bookingService.createBooking(payload);
        return (0, response_1.successResponse)(res, booking, 'Booking created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create booking';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listBookings(req, res) {
    try {
        const filters = {};
        if (req.query.customerId)
            filters.customerId = Number(req.query.customerId);
        if (req.query.barberId)
            filters.barberId = Number(req.query.barberId);
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.dateFrom)
            filters.dateFrom = new Date(req.query.dateFrom);
        if (req.query.dateTo)
            filters.dateTo = new Date(req.query.dateTo);
        const bookings = await bookingService.listBookings(filters);
        return (0, response_1.successResponse)(res, bookings);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getBooking(req, res) {
    try {
        const id = Number(req.params.id);
        const booking = await bookingService.getBookingById(id);
        if (!booking)
            return (0, response_1.errorResponse)(res, 'Booking not found', 404);
        return (0, response_1.successResponse)(res, booking);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch booking';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateStatus(req, res) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const booking = await bookingService.updateBookingStatus(id, status);
        return (0, response_1.successResponse)(res, booking, 'Booking status updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update status';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function reschedule(req, res) {
    try {
        const id = Number(req.params.id);
        const payload = {};
        if (req.body.bookingDate)
            payload.bookingDate = new Date(req.body.bookingDate);
        if (req.body.startTime)
            payload.startTime = req.body.startTime;
        if (req.body.barberId)
            payload.barberId = Number(req.body.barberId);
        if (req.body.resourceId !== undefined)
            payload.resourceId = req.body.resourceId === null ? null : Number(req.body.resourceId);
        const booking = await bookingService.rescheduleBooking(id, payload);
        return (0, response_1.successResponse)(res, booking, 'Booking rescheduled');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reschedule';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function cancel(req, res) {
    try {
        const id = Number(req.params.id);
        const booking = await bookingService.cancelBooking(id);
        return (0, response_1.successResponse)(res, booking, 'Booking cancelled');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to cancel booking';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=booking.controller.js.map