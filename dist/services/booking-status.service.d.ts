export declare function updateBookingStatus(id: number, status: string): Promise<{
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
            id: number;
            email: string;
            phone: string | null;
            password: string;
            name: string;
            role: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        id: number;
        email: string;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
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
}>;
export declare function rescheduleBooking(id: number, data: {
    bookingDate?: Date;
    startTime?: string;
    barberId?: number;
    resourceId?: number | null;
}): Promise<{
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
    barber: {
        user: {
            name: string;
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
        name: string;
    };
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
}>;
export declare function cancelBooking(id: number): Promise<{
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
}>;
//# sourceMappingURL=booking-status.service.d.ts.map