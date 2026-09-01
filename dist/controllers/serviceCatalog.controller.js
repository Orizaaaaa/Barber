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
exports.createServiceValidators = void 0;
exports.createService = createService;
exports.listServices = listServices;
exports.getService = getService;
exports.updateService = updateService;
exports.deleteService = deleteService;
const express_validator_1 = require("express-validator");
const serviceCatalog = __importStar(require("../services/serviceCatalog.service"));
const response_1 = require("../utils/response");
exports.createServiceValidators = [
    (0, express_validator_1.body)('name').notEmpty().trim(),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }),
    (0, express_validator_1.body)('duration').isInt({ min: 5 }),
];
async function createService(req, res) {
    try {
        const service = await serviceCatalog.createService(req.body);
        return (0, response_1.successResponse)(res, service, 'Service created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create service';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listServices(req, res) {
    try {
        const activeOnly = req.query.activeOnly !== 'false';
        const services = await serviceCatalog.listServices(activeOnly);
        return (0, response_1.successResponse)(res, services);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch services';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getService(req, res) {
    try {
        const id = Number(req.params.id);
        const service = await serviceCatalog.getServiceById(id);
        if (!service)
            return (0, response_1.errorResponse)(res, 'Service not found', 404);
        return (0, response_1.successResponse)(res, service);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch service';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateService(req, res) {
    try {
        const id = Number(req.params.id);
        const service = await serviceCatalog.updateService(id, req.body);
        return (0, response_1.successResponse)(res, service, 'Service updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update service';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function deleteService(req, res) {
    try {
        const id = Number(req.params.id);
        await serviceCatalog.deleteService(id);
        return (0, response_1.successResponse)(res, null, 'Service deleted');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete service';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=serviceCatalog.controller.js.map