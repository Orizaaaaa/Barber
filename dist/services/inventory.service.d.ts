export declare function createItem(data: {
    name: string;
    description?: string;
    unit?: string;
    quantity: number;
    minStock?: number;
    unitCost?: number;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}>;
export declare function listItems(lowStock?: boolean): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}[]>;
export declare function getItemById(id: number): Promise<({
    usages: ({
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
    } & {
        id: number;
        createdAt: Date;
        serviceId: number;
        bookingId: number;
        itemId: number;
        quantity: number;
    })[];
} & {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}) | null>;
export declare function updateItem(id: number, data: Partial<{
    name: string;
    description: string;
    unit: string;
    quantity: number;
    minStock: number;
    unitCost: number;
}>): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}>;
export declare function deleteItem(id: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}>;
export declare function addStock(id: number, amount: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    quantity: number;
    unit: string;
    minStock: number;
    unitCost: number;
}>;
export declare function linkItemToService(itemId: number, serviceId: number, quantity: number): Promise<{
    id: number;
    createdAt: Date;
    serviceId: number;
    bookingId: number;
    itemId: number;
    quantity: number;
}>;
//# sourceMappingURL=inventory.service.d.ts.map