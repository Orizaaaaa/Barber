"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = createItem;
exports.listItems = listItems;
exports.getItemById = getItemById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.addStock = addStock;
exports.linkItemToService = linkItemToService;
const prisma_1 = require("../config/prisma");
async function createItem(data) {
    return prisma_1.prisma.inventoryItem.create({ data });
}
async function listItems(lowStock = false) {
    const where = lowStock ? { quantity: { lte: prisma_1.prisma.inventoryItem.fields.minStock } } : undefined;
    return prisma_1.prisma.inventoryItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
}
async function getItemById(id) {
    return prisma_1.prisma.inventoryItem.findUnique({
        where: { id },
        include: { usages: { include: { service: true } } },
    });
}
async function updateItem(id, data) {
    return prisma_1.prisma.inventoryItem.update({ where: { id }, data });
}
async function deleteItem(id) {
    return prisma_1.prisma.inventoryItem.delete({ where: { id } });
}
async function addStock(id, amount) {
    return prisma_1.prisma.inventoryItem.update({
        where: { id },
        data: { quantity: { increment: amount } },
    });
}
async function linkItemToService(itemId, serviceId, quantity) {
    // This creates a template usage record. Actual deduction happens on booking completion.
    return prisma_1.prisma.inventoryUsage.create({
        data: { itemId, serviceId, bookingId: 0, quantity },
    });
}
//# sourceMappingURL=inventory.service.js.map