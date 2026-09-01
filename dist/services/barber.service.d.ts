export declare function createBarber(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    specialty?: string;
    experience?: number;
    bio?: string;
    compensationType?: string;
    baseSalary?: number;
    commissionRate?: number;
}): Promise<{
    barberProfile: {
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
    } | null;
} & {
    id: number;
    email: string;
    phone: string | null;
    password: string;
    name: string;
    role: string;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function listBarbers(includeInactive?: boolean): Promise<({
    user: {
        id: number;
        email: string;
        phone: string | null;
        name: string;
        avatar: string | null;
    };
    _count: {
        portfolios: number;
        bookings: number;
    };
    schedules: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        barberId: number;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isDayOff: boolean;
    }[];
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
})[]>;
export declare function getBarberById(id: number): Promise<({
    user: {
        id: number;
        email: string;
        phone: string | null;
        name: string;
        avatar: string | null;
    };
    schedules: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        barberId: number;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isDayOff: boolean;
    }[];
    portfolios: {
        id: number;
        createdAt: Date;
        barberId: number;
        imageUrl: string;
        caption: string | null;
    }[];
    bookings: ({
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
    })[];
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
}) | null>;
export declare function updateBarber(id: number, data: Partial<{
    specialty: string;
    experience: number;
    bio: string;
    isActive: boolean;
    compensationType: string;
    baseSalary: number;
    commissionRate: number;
}>): Promise<{
    user: {
        id: number;
        email: string;
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
}>;
export declare function upsertSchedule(barberId: number, schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isDayOff: boolean;
}[]): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    barberId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isDayOff: boolean;
}[]>;
/**
 * Get the barber with fewest bookings on a given date (fair round-robin).
 * Ties broken by total bookings overall.
 */
export declare function getRandomBarber(date: Date): Promise<{
    barberId: number;
    barberName: string;
} | null>;
export declare function addPortfolio(barberId: number, imageUrl: string, caption?: string): Promise<{
    id: number;
    createdAt: Date;
    barberId: number;
    imageUrl: string;
    caption: string | null;
}>;
export declare function removePortfolio(id: number): Promise<{
    id: number;
    createdAt: Date;
    barberId: number;
    imageUrl: string;
    caption: string | null;
}>;
/**
 * Get barber earnings: daily breakdown, unpaid commission, total earnings
 */
export declare function getBarberEarnings(barberId: number, userId: number, period?: 'day' | 'week' | 'month', dateStr?: string): Promise<{
    barberId: number;
    barberName: string;
    compensationType: string;
    commissionRate: number;
    period: "week" | "day" | "month";
    periodStart: string;
    periodEnd: string;
    periodStats: {
        revenue: number;
        commission: number;
        bookingCount: number;
    };
    unpaid: {
        revenue: number;
        commission: number;
        bookingCount: number;
    };
    paidOut: {
        total: number;
        payrollCount: number;
    };
    dailyBreakdown: {
        date: string;
        revenue: number;
        count: number;
        commission: number;
        bookings: {
            id: number;
            service: string;
            customer: string;
            amount: number;
            time: string;
        }[];
    }[];
}>;
export declare function getBarberAvailability(barberId: number, date: Date): Promise<{
    available: boolean;
    slots: never[];
    schedule?: undefined;
} | {
    available: boolean;
    schedule: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        barberId: number;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isDayOff: boolean;
    };
    slots: string[];
}>;
//# sourceMappingURL=barber.service.d.ts.map