import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/password';

export async function createUser(data: { email: string; password: string; name: string; phone?: string; role: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already exists');
  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      phone: data.phone,
      role: data.role,
    },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
  return user;
}

export async function listUsers(role?: string) {
  const where = role ? { role } : {};
  return prisma.user.findMany({
    where,
    select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      barberProfile: true,
      customerData: true,
    },
  });
}

export async function updateUser(id: number, data: Partial<{ name: string; phone: string; avatar: string }>) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, phone: true, avatar: true },
  });
}
