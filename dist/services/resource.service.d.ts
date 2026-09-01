export declare function createResource(data: {
    name: string;
    type: string;
    capacity?: number;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    capacity: number;
}>;
export declare function listResources(activeOnly?: boolean): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    capacity: number;
}[]>;
export declare function getResourceById(id: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    capacity: number;
} | null>;
export declare function updateResource(id: number, data: Partial<{
    name: string;
    type: string;
    capacity: number;
    isActive: boolean;
}>): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    capacity: number;
}>;
export declare function deleteResource(id: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    capacity: number;
}>;
//# sourceMappingURL=resource.service.d.ts.map