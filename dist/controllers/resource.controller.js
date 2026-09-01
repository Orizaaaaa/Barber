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
exports.createResourceValidators = void 0;
exports.createResource = createResource;
exports.listResources = listResources;
exports.getResource = getResource;
exports.updateResource = updateResource;
exports.deleteResource = deleteResource;
const express_validator_1 = require("express-validator");
const resourceService = __importStar(require("../services/resource.service"));
const response_1 = require("../utils/response");
exports.createResourceValidators = [
    (0, express_validator_1.body)('name').notEmpty().trim(),
    (0, express_validator_1.body)('type').notEmpty().trim(),
];
async function createResource(req, res) {
    try {
        const resource = await resourceService.createResource(req.body);
        return (0, response_1.successResponse)(res, resource, 'Resource created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create resource';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listResources(req, res) {
    try {
        const activeOnly = req.query.activeOnly === 'true';
        const resources = await resourceService.listResources(activeOnly);
        return (0, response_1.successResponse)(res, resources);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch resources';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getResource(req, res) {
    try {
        const id = Number(req.params.id);
        const resource = await resourceService.getResourceById(id);
        if (!resource)
            return (0, response_1.errorResponse)(res, 'Resource not found', 404);
        return (0, response_1.successResponse)(res, resource);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch resource';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function updateResource(req, res) {
    try {
        const id = Number(req.params.id);
        const resource = await resourceService.updateResource(id, req.body);
        return (0, response_1.successResponse)(res, resource, 'Resource updated');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update resource';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function deleteResource(req, res) {
    try {
        const id = Number(req.params.id);
        await resourceService.deleteResource(id);
        return (0, response_1.successResponse)(res, null, 'Resource deleted');
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete resource';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=resource.controller.js.map