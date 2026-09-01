export declare function getDashboardOverview(): Promise<{
    totalBookings: number;
    todayBookings: number;
    pendingPayments: number;
    totalRevenue: number;
    totalCustomers: number;
    totalBarbers: number;
}>;
export declare function getRevenueReport(dateFrom: Date, dateTo: Date): Promise<{
    total: number;
    byService: {
        [k: string]: number;
    };
    byBarber: {
        [k: string]: number;
    };
    payments: ({
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
    })[];
}>;
export declare function getBookingReport(dateFrom: Date, dateTo: Date): Promise<{
    total: number;
    statusCounts: {
        [k: string]: number;
    };
    byService: {
        [k: string]: number;
    };
    byBarber: {
        [k: string]: number;
    };
}>;
//# sourceMappingURL=report.service.d.ts.map