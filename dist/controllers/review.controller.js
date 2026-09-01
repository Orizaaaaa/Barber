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
exports.createReviewValidators = void 0;
exports.createReview = createReview;
exports.listReviews = listReviews;
exports.getReview = getReview;
const express_validator_1 = require("express-validator");
const reviewService = __importStar(require("../services/review.service"));
const response_1 = require("../utils/response");
exports.createReviewValidators = [
    (0, express_validator_1.body)('bookingId').isInt({ min: 1 }),
    (0, express_validator_1.body)('rating').isInt({ min: 1, max: 5 }),
];
async function createReview(req, res) {
    try {
        const review = await reviewService.createReview(req.body);
        return (0, response_1.successResponse)(res, review, 'Review created', 201);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create review';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function listReviews(req, res) {
    try {
        const barberId = req.query.barberId ? Number(req.query.barberId) : undefined;
        const reviews = await reviewService.listReviews(barberId);
        return (0, response_1.successResponse)(res, reviews);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
async function getReview(req, res) {
    try {
        const bookingId = Number(req.params.bookingId);
        const review = await reviewService.getReviewByBookingId(bookingId);
        if (!review)
            return (0, response_1.errorResponse)(res, 'Review not found', 404);
        return (0, response_1.successResponse)(res, review);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch review';
        return (0, response_1.errorResponse)(res, message, 400);
    }
}
//# sourceMappingURL=review.controller.js.map