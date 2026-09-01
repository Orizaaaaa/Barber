"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.listNotifications = listNotifications;
exports.markRead = markRead;
exports.markAllRead = markAllRead;
const prisma_1 = require("../config/prisma");
async function createNotification(data) {
    return prisma_1.prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
            channel: data.channel || 'PUSH',
        },
    });
}
async function listNotifications(userId) {
    return prisma_1.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function markRead(id) {
    return prisma_1.prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
}
async function markAllRead(userId) {
    return prisma_1.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
//# sourceMappingURL=notification.service.js.map