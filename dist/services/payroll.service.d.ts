export type CompensationType = 'COMMISSION' | 'FIXED' | 'HYBRID';
export interface PayrollPreview {
    barberId: number;
    barberName: string;
    compensationType: CompensationType;
    commissionRate: number;
    periodStart: Date;
    periodEnd: Date;
    bookingCount: number;
    totalRevenue: number;
    baseSalaryPortion: number;
    commission: number;
    bonus: number;
    deductions: number;
    total: number;
}
/** Gaji pokok bulanan diprorata sesuai jumlah hari periode */
export declare function prorateMonthlySalary(baseSalary: number, periodStart: Date, periodEnd: Date): number;
export declare function previewPayroll(barberId: number, periodStart: Date, periodEnd: Date, options?: {
    bonus?: number;
    deductions?: number;
}): Promise<PayrollPreview>;
export declare function generatePayroll(barberId: number, periodStart: Date, periodEnd: Date, options?: {
    bonus?: number;
    deductions?: number;
}): Promise<{
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
    baseSalary: number;
    barberId: number;
    periodStart: Date;
    periodEnd: Date;
    commission: number;
    bonus: number;
    deductions: number;
    total: number;
    type: string;
    isPaid: boolean;
    paidAt: Date | null;
}>;
export declare function createPayroll(data: {
    barberId: number;
    periodStart: Date;
    periodEnd: Date;
    baseSalary?: number;
    commission?: number;
    bonus?: number;
    deductions?: number;
    total: number;
    type?: string;
}): Promise<{
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
    baseSalary: number;
    barberId: number;
    periodStart: Date;
    periodEnd: Date;
    commission: number;
    bonus: number;
    deductions: number;
    total: number;
    type: string;
    isPaid: boolean;
    paidAt: Date | null;
}>;
export declare function listPayrolls(barberId?: number): Promise<({
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
    baseSalary: number;
    barberId: number;
    periodStart: Date;
    periodEnd: Date;
    commission: number;
    bonus: number;
    deductions: number;
    total: number;
    type: string;
    isPaid: boolean;
    paidAt: Date | null;
})[]>;
export declare function markPaid(id: number): Promise<{
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
    baseSalary: number;
    barberId: number;
    periodStart: Date;
    periodEnd: Date;
    commission: number;
    bonus: number;
    deductions: number;
    total: number;
    type: string;
    isPaid: boolean;
    paidAt: Date | null;
}>;
/** @deprecated use previewPayroll */
export declare function calculateCommission(barberId: number, periodStart: Date, periodEnd: Date, commissionRate?: number): Promise<{
    totalRevenue: number;
    commission: number;
    bookingCount: number;
    commissionRate: number;
}>;
//# sourceMappingURL=payroll.service.d.ts.map