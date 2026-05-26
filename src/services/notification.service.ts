import { prisma } from '../config/prisma';

export async function createNotification(data: { userId: number; title: string; message: string; channel?: string }) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      channel: data.channel || 'PUSH',
    },
  });
}

export async function listNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markRead(id: number) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllRead(userId: number) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
