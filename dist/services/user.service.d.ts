export declare function createUser(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: string;
}): Promise<{
    id: number;
    email: string;
    phone: string | null;
    name: string;
    role: string;
    createdAt: Date;
}>;
export declare function listUsers(role?: string): Promise<{
    id: number;
    email: string;
    phone: string | null;
    name: string;
    role: string;
    avatar: string | null;
    createdAt: Date;
}[]>;
export declare function getUserById(id: number): Promise<({
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
}) | null>;
export declare function updateUser(id: number, data: Partial<{
    name: string;
    phone: string;
    avatar: string;
}>): Promise<{
    id: number;
    email: string;
    phone: string | null;
    name: string;
    role: string;
    avatar: string | null;
}>;
//# sourceMappingURL=user.service.d.ts.map