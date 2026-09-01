export declare function createService(data: {
    name: string;
    description?: string;
    price: number;
    duration: number;
    image?: string;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
}>;
export declare function listServices(activeOnly?: boolean): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
}[]>;
export declare function getServiceById(id: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
} | null>;
export declare function updateService(id: number, data: Partial<{
    name: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    isActive: boolean;
}>): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
}>;
export declare function deleteService(id: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description: string | null;
    price: number;
    duration: number;
    image: string | null;
}>;
//# sourceMappingURL=serviceCatalog.service.d.ts.map