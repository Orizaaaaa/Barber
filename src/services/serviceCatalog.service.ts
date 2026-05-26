import { prisma } from '../config/prisma';

export async function createService(data: { name: string; description?: string; price: number; duration: number; image?: string }) {
  return prisma.service.create({ data });
}

export async function listServices(activeOnly = true) {
  return prisma.service.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getServiceById(id: number) {
  return prisma.service.findUnique({ where: { id } });
}

export async function updateService(id: number, data: Partial<{ name: string; description: string; price: number; duration: number; image: string; isActive: boolean }>) {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: number) {
  return prisma.service.delete({ where: { id } });
}
