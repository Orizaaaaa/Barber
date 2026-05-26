import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export async function registerCustomer(data: { email: string; password: string; name: string; phone?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already registered');

  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      phone: data.phone,
      role: 'CUSTOMER',
      customerData: { create: {} },
    },
    select: { id: true, email: true, name: true, role: true, phone: true },
  });

  const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  return { user, token };
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    token,
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
  });
  if (!user) throw new Error('User not found');
  return user;
}
