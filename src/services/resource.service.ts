import { prisma } from '../config/prisma';

export async function createResource(data: { name: string; type: string; capacity?: number }) {
  return prisma.resource.create({ data });
}

export async function listResources() {
  return prisma.resource.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getResourceById(id: number) {
  return prisma.resource.findUnique({ where: { id } });
}

export async function updateResource(id: number, data: Partial<{ name: string; type: string; capacity: number; isActive: boolean }>) {
  return prisma.resource.update({ where: { id }, data });
}

export async function deleteResource(id: number) {
  return prisma.resource.delete({ where: { id } });
}
