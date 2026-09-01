export declare function createNotification(data: {
    userId: number;
    title: string;
    message: string;
    channel?: string;
}): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    title: string;
    message: string;
    channel: string;
    isRead: boolean;
    sentAt: Date | null;
}>;
export declare function listNotifications(userId: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    title: string;
    message: string;
    channel: string;
    isRead: boolean;
    sentAt: Date | null;
}[]>;
export declare function markRead(id: number): Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    title: string;
    message: string;
    channel: string;
    isRead: boolean;
    sentAt: Date | null;
}>;
export declare function markAllRead(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=notification.service.d.ts.map