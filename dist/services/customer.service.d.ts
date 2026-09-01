export declare function getCustomerData(userId: number): Promise<({
    user: {
        email: string;
        phone: string | null;
        name: string;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    totalVisits: number;
    totalSpent: number;
    lastVisit: Date | null;
    preferences: string | null;
    birthDate: Date | null;
    notes: string | null;
    userId: number;
}) | null>;
export declare function updateCustomerData(userId: number, data: Partial<{
    preferences: string;
    birthDate?: Date;
    notes: string;
}>): Promise<{
    user: {
        email: string;
        phone: string | null;
        name: string;
    };
} & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    totalVisits: number;
    totalSpent: number;
    lastVisit: Date | null;
    preferences: string | null;
    birthDate: Date | null;
    notes: string | null;
    userId: number;
}>;
export declare function getLoyaltyPoints(userId: number): Promise<{
    total: number;
    history: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
        points: number;
        expiryDate: Date | null;
    }[];
}>;
export declare function listCustomers(search?: string): Promise<{
    customerData: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        totalVisits: number;
        totalSpent: number;
        lastVisit: Date | null;
        preferences: string | null;
        birthDate: Date | null;
        notes: string | null;
        userId: number;
    } | null;
    id: number;
    email: string;
    phone: string | null;
    name: string;
    createdAt: Date;
}[]>;
export declare function getCustomerBookings(userId: number): Promise<({
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
})[]>;
//# sourceMappingURL=customer.service.d.ts.map