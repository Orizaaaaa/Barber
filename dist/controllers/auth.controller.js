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
exports.loginValidators = exports.registerValidators = void 0;
exports.register = register;
exports.login = login;
exports.me = me;
const express_validator_1 = require("express-validator");
const authService = __importStar(require("../services/auth.service"));
const response_1 = require("../utils/response");
exports.registerValidators = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('name').notEmpty().trim(),
];
exports.loginValidators = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
];
async function register(req, res) {
    try {
        const result = await authService.registerCustomer(req.body);
        return (0, response_1.successResponse)(res, result, 'Registered successfully', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function login(req, res) {
    try {
        const result = await authService.login(req.body);
        return (0, response_1.successResponse)(res, result, 'Logged in successfully');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        return (0, response_1.errorResponse)(res, message, 401);
    }
}
async function me(req, res) {
    try {
        const user = await authService.getMe(req.user.id);
        return (0, response_1.successResponse)(res, user);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch profile';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=auth.controller.js.map