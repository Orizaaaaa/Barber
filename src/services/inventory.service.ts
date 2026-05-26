import { prisma } from '../config/prisma';

export async function createItem(data: { name: string; description?: string; unit?: string; quantity: number; minStock?: number; unitCost?: number }) {
  return prisma.inventoryItem.create({ data });
}

export async function listItems(lowStock = false) {
  const where = lowStock ? { quantity: { lte: prisma.inventoryItem.fields.minStock } } : undefined;
  return prisma.inventoryItem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getItemById(id: number) {
  return prisma.inventoryItem.findUnique({
    where: { id },
    include: { usages: { include: { service: true } } },
  });
}

export async function updateItem(id: number, data: Partial<{ name: string; description: string; unit: string; quantity: number; minStock: number; unitCost: number }>) {
  return prisma.inventoryItem.update({ where: { id }, data });
}

export async function deleteItem(id: number) {
  return prisma.inventoryItem.delete({ where: { id } });
}

export async function addStock(id: number, amount: number) {
  return prisma.inventoryItem.update({
    where: { id },
    data: { quantity: { increment: amount } },
  });
}

export async function linkItemToService(itemId: number, serviceId: number, quantity: number) {
  // This creates a template usage record. Actual deduction happens on booking completion.
  return prisma.inventoryUsage.create({
    data: { itemId, serviceId, bookingId: 0, quantity },
  });
}
