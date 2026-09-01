export declare function registerCustomer(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
}): Promise<{
    user: {
        id: number;
        email: string;
        phone: string | null;
        name: string;
        role: string;
    };
    token: string;
}>;
export declare function login(data: {
    email: string;
    password: string;
}): Promise<{
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
        phone: string | null;
    };
    token: string;
}>;
export declare function getMe(userId: number): Promise<{
    id: number;
    email: string;
    phone: string | null;
    name: string;
    role: string;
    avatar: string | null;
    createdAt: Date;
}>;
//# sourceMappingURL=auth.service.d.ts.map