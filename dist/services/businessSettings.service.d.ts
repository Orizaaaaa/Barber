export declare function getSettings(): Promise<{
    id: number;
    email: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    barberSelectionFee: number;
    shopName: string;
    address: string | null;
    openingTime: string;
    closingTime: string;
    slotDuration: number;
    allowBookingDays: number;
} | null>;
export declare function upsertSettings(data: {
    shopName: string;
    address?: string;
    phone?: string;
    email?: string;
    openingTime?: string;
    closingTime?: string;
    slotDuration?: number;
    allowBookingDays?: number;
}): Promise<{
    id: number;
    email: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    barberSelectionFee: number;
    shopName: string;
    address: string | null;
    openingTime: string;
    closingTime: string;
    slotDuration: number;
    allowBookingDays: number;
}>;
//# sourceMappingURL=businessSettings.service.d.ts.map