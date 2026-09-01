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
const express_1 = require("express");
const payrollController = __importStar(require("../controllers/payroll.controller"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), payrollController.createPayrollValidators, validation_1.validate, payrollController.createPayroll);
router.post('/generate', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), payrollController.generatePayrollValidators, validation_1.validate, payrollController.generatePayroll);
router.get('/preview/:barberId', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), payrollController.previewPayroll);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'BARBER'), payrollController.listPayrolls);
router.patch('/:id/paid', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), payrollController.markPaid);
router.get('/calculate/:barberId', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), payrollController.calculateCommission);
exports.default = router;
//# sourceMappingURL=payroll.routes.js.map