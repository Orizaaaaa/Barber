export declare function createBooking(data: {
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
    barberId: number | 'random';
    serviceId: number;
    resourceId?: number;
    bookingDate: Date;
    startTime: string;
    notes?: string;
    promoCode?: string;
}): Promise<({
    service: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
    };
    review: {
        id: number;
        createdAt: Date;
        bookingId: number;
        rating: number;
        comment: string | null;
    } | null;
    resource: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        type: string;
        capacity: number;
    } | null;
    payment: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        paidAt: Date | null;
        bookingId: number;
        amount: number;
        barberSelectionFee: number;
        discountAmount: number;
        promoCode: string | null;
        finalAmount: number;
        paidAmount: number;
        method: string | null;
        transactionId: string | null;
    } | null;
    barber: {
        user: {
            name: string;
            avatar: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        specialty: string | null;
        experience: number | null;
        bio: string | null;
        isActive: boolean;
        compensationType: string;
        baseSalary: number;
        commissionRate: number;
        userId: number;
    };
    customer: {
        phone: string | null;
        name: string;
    };
    inventoryUsages: ({
        item: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            quantity: number;
            unit: string;
            minStock: number;
            unitCost: number;
        };
    } & {
        id: number;
        createdAt: Date;
        serviceId: number;
        bookingId: number;
        itemId: number;
        quantity: number;
    })[];
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    notes: string | null;
    barberId: number;
    startTime: string;
    endTime: string;
    customerId: number;
    serviceId: number;
    resourceId: number | null;
    bookingDate: Date;
    status: string;
}) | null>;
//# sourceMappingURL=booking-create.service.d.ts.map