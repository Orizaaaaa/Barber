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
exports.createNotificationValidators = void 0;
exports.createNotification = createNotification;
exports.listMyNotifications = listMyNotifications;
exports.markRead = markRead;
exports.markAllRead = markAllRead;
const express_validator_1 = require("express-validator");
const notificationService = __importStar(require("../services/notification.service"));
const response_1 = require("../utils/response");
exports.createNotificationValidators = [
    (0, express_validator_1.body)('userId').isInt({ min: 1 }),
    (0, express_validator_1.body)('title').notEmpty().trim(),
    (0, express_validator_1.body)('message').notEmpty().trim(),
];
async function createNotification(req, res) {
    try {
        const notification = await notificationService.createNotification(req.body);
        return (0, response_1.successResponse)(res, notification, 'Notification created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create notification';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listMyNotifications(req, res) {
    try {
        const notifications = await notificationService.listNotifications(req.user.id);
        return (0, response_1.successResponse)(res, notifications);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function markRead(req, res) {
    try {
        const id = Number(req.params.id);
        const notification = await notificationService.markRead(id);
        return (0, response_1.successResponse)(res, notification, 'Marked as read');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark read';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function markAllRead(req, res) {
    try {
        await notificationService.markAllRead(req.user.id);
        return (0, response_1.successResponse)(res, null, 'All notifications marked as read');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark all read';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=notification.controller.js.map