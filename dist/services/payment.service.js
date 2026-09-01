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
exports.recordPayment = recordPayment;
exports.getPaymentByBookingId = getPaymentByBookingId;
exports.listPayments = listPayments;
const prisma_1 = require("../config/prisma");
const bookingService = __importStar(require("./booking.service"));
async function recordPayment(bookingId, data) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: { bookingId },
        include: { booking: true },
    });
    if (!payment)
        throw new Error('Payment record not found');
    if (payment.booking.status === 'CANCELLED') {
        throw new Error('Cannot record payment for a cancelled booking');
    }
    if (payment.status === 'PAID') {
        throw new Error('This booking is already fully paid');
    }
    const remaining = payment.amount - payment.paidAmount;
    if (data.amount <= 0)
        throw new Error('Payment amount must be greater than 0');
    if (data.amount > remaining + 0.01) {
        throw new Error(`Amount exceeds remaining balance (Rp ${Math.round(remaining).toLocaleString('id-ID')})`);
    }
    const newPaid = payment.paidAmount + data.amount;
    const status = newPaid >= payment.amount ? 'PAID' : 'PARTIAL';
    const updatedPayment = await prisma_1.prisma.payment.update({
        where: { bookingId },
        data: {
            paidAmount: newPaid,
            status,
            method: data.method,
            transactionId: data.transactionId || payment.transactionId,
            paidAt: status === 'PAID' ? new Date() : payment.paidAt,
        },
        include: {
            booking: {
                include: {
                    service: true,
                    customer: { select: { id: true, name: true, phone: true } },
                },
            },
        },
    });
    // Notify customer about payment
    if (updatedPayment.booking.customer?.id) {
        const msg = status === 'PAID'
            ? `Pembayaran untuk ${updatedPayment.booking.service.name} telah lunas. Terima kasih!`
            : `Pembayaran sebagian Rp ${data.amount.toLocaleString('id-ID')} untuk ${updatedPayment.booking.service.name} telah diterima`;
        await prisma_1.prisma.notification.create({
            data: {
                userId: updatedPayment.booking.customer.id,
                title: status === 'PAID' ? 'Pembayaran Lunas' : 'Pembayaran Diterima',
                message: msg,
                channel: 'PUSH',
            },
        });
    }
    const shouldComplete = data.markCompleted !== false && status === 'PAID';
    if (shouldComplete && updatedPayment.booking.status !== 'COMPLETED') {
        if (updatedPayment.booking.status === 'PENDING') {
            await prisma_1.prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CONFIRMED' },
            });
        }
        await bookingService.updateBookingStatus(bookingId, 'COMPLETED');
    }
    return prisma_1.prisma.payment.findUnique({
        where: { bookingId },
        include: {
            booking: {
                include: {
                    service: true,
                    customer: { select: { name: true, phone: true } },
                },
            },
        },
    });
}
async function getPaymentByBookingId(bookingId) {
    return prisma_1.prisma.payment.findUnique({ where: { bookingId } });
}
async function listPayments() {
    return prisma_1.prisma.payment.findMany({
        include: { booking: { include: { service: true, customer: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
    });
}
//# sourceMappingURL=payment.service.js.map