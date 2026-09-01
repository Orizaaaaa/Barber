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
exports.createBarberValidators = void 0;
exports.createBarber = createBarber;
exports.listBarbers = listBarbers;
exports.getBarber = getBarber;
exports.updateBarber = updateBarber;
exports.setSchedule = setSchedule;
exports.getAvailability = getAvailability;
exports.getRandomBarber = getRandomBarber;
exports.getMyEarnings = getMyEarnings;
exports.addPortfolio = addPortfolio;
exports.removePortfolio = removePortfolio;
const express_validator_1 = require("express-validator");
const barberService = __importStar(require("../services/barber.service"));
const password_1 = require("../utils/password");
const response_1 = require("../utils/response");
exports.createBarberValidators = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('name').notEmpty().trim(),
];
async function createBarber(req, res) {
    try {
        const payload = { ...req.body, password: await (0, password_1.hashPassword)(req.body.password) };
        const barber = await barberService.createBarber(payload);
        return (0, response_1.successResponse)(res, barber, 'Barber created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create barber';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listBarbers(req, res) {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const barbers = await barberService.listBarbers(includeInactive);
        return (0, response_1.successResponse)(res, barbers);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch barbers';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getBarber(req, res) {
    try {
        const id = Number(req.params.id);
        const barber = await barberService.getBarberById(id);
        if (!barber)
            return (0, response_1.errorResponse)(res, 'Barber not found', 404);
        return (0, response_1.successResponse)(res, barber);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch barber';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateBarber(req, res) {
    try {
        const id = Number(req.params.id);
        const barber = await barberService.updateBarber(id, req.body);
        return (0, response_1.successResponse)(res, barber, 'Barber updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update barber';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function setSchedule(req, res) {
    try {
        const barberId = Number(req.params.id);
        const schedules = req.body.schedules;
        const result = await barberService.upsertSchedule(barberId, schedules);
        return (0, response_1.successResponse)(res, result, 'Schedule updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update schedule';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getAvailability(req, res) {
    try {
        const barberId = Number(req.params.id);
        const dateStr = req.query.date;
        const date = dateStr ? new Date(dateStr) : new Date();
        const result = await barberService.getBarberAvailability(barberId, date);
        return (0, response_1.successResponse)(res, result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch availability';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getRandomBarber(req, res) {
    try {
        const dateStr = req.query.date;
        const date = dateStr ? new Date(dateStr) : new Date();
        const result = await barberService.getRandomBarber(date);
        if (!result)
            return (0, response_1.errorResponse)(res, 'No available barbers for this date', 404);
        return (0, response_1.successResponse)(res, result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get random barber';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getMyEarnings(req, res) {
    try {
        if (!req.user)
            return (0, response_1.errorResponse)(res, 'Unauthorized', 401);
        const period = req.query.period || 'month';
        const date = req.query.date;
        if (!['day', 'week', 'month'].includes(period)) {
            return (0, response_1.errorResponse)(res, 'Period must be day, week, or month', 400);
        }
        // Find barber profile by user ID
        const barberProfile = await (await Promise.resolve().then(() => __importStar(require('../config/prisma')))).prisma.barberProfile.findUnique({
            where: { userId: req.user.id },
        });
        if (!barberProfile)
            return (0, response_1.errorResponse)(res, 'Barber profile not found', 404);
        const result = await barberService.getBarberEarnings(barberProfile.id, req.user.id, period, date);
        return (0, response_1.successResponse)(res, result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch earnings';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function addPortfolio(req, res) {
    try {
        const barberId = Number(req.params.id);
        const { imageUrl, caption } = req.body;
        const portfolio = await barberService.addPortfolio(barberId, imageUrl, caption);
        return (0, response_1.successResponse)(res, portfolio, 'Portfolio added', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add portfolio';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function removePortfolio(req, res) {
    try {
        const id = Number(req.params.portfolioId);
        await barberService.removePortfolio(id);
        return (0, response_1.successResponse)(res, null, 'Portfolio removed');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove portfolio';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=barber.controller.js.map