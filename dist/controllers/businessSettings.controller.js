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
exports.updateSettingsValidators = void 0;
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const express_validator_1 = require("express-validator");
const settingsService = __importStar(require("../services/businessSettings.service"));
const response_1 = require("../utils/response");
exports.updateSettingsValidators = [
    (0, express_validator_1.body)('shopName').optional().trim(),
    (0, express_validator_1.body)('openingTime').optional().matches(/^\d{2}:\d{2}$/),
    (0, express_validator_1.body)('closingTime').optional().matches(/^\d{2}:\d{2}$/),
];
async function getSettings(req, res) {
    try {
        const settings = await settingsService.getSettings();
        return (0, response_1.successResponse)(res, settings);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch settings';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateSettings(req, res) {
    try {
        const settings = await settingsService.upsertSettings(req.body);
        return (0, response_1.successResponse)(res, settings, 'Settings updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update settings';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=businessSettings.controller.js.map