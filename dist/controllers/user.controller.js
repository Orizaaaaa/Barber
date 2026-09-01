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
exports.createUserValidators = void 0;
exports.createUser = createUser;
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.updateProfile = updateProfile;
const express_validator_1 = require("express-validator");
const userService = __importStar(require("../services/user.service"));
const response_1 = require("../utils/response");
exports.createUserValidators = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('name').notEmpty().trim(),
    (0, express_validator_1.body)('role').isIn(['CUSTOMER', 'BARBER', 'ADMIN']),
];
async function createUser(req, res) {
    try {
        const user = await userService.createUser(req.body);
        return (0, response_1.successResponse)(res, user, 'User created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create user';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listUsers(req, res) {
    try {
        const role = req.query.role;
        const users = await userService.listUsers(role);
        return (0, response_1.successResponse)(res, users);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch users';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getUser(req, res) {
    try {
        const id = Number(req.params.id);
        const user = await userService.getUserById(id);
        if (!user)
            return (0, response_1.errorResponse)(res, 'User not found', 404);
        return (0, response_1.successResponse)(res, user);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch user';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateProfile(req, res) {
    try {
        const id = req.user.id;
        const user = await userService.updateUser(id, req.body);
        return (0, response_1.successResponse)(res, user, 'Profile updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=user.controller.js.map