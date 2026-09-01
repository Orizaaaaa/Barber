export declare function recordPayment(bookingId: number, data: {
    amount: number;
    method: string;
    transactionId?: string;
    markCompleted?: boolean;
}): Promise<({
    booking: {
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
        customer: {
            phone: string | null;
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
    };
} & {
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
}) | null>;
export declare function getPaymentByBookingId(bookingId: number): Promise<{
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
} | null>;
export declare function listPayments(): Promise<({
    booking: {
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
    };
} & {
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
})[]>;
//# sourceMappingURL=payment.service.d.ts.map