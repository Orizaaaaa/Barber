import { prisma } from '../config/prisma';

export async function createPromo(data: {
  code: string;
  name: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minSpend?: number;
  maxUses?: number;
  startDate: Date;
  endDate: Date;
}) {
  return prisma.promo.create({ data });
}

export async function listPromos(activeOnly = false) {
  const where: Record<string, unknown> = {};
  if (activeOnly) {
    where.isActive = true;
    where.endDate = { gte: new Date() };
    where.startDate = { lte: new Date() };
  }
  return prisma.promo.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function getPromoById(id: number) {
  return prisma.promo.findUnique({ where: { id } });
}

export async function updatePromo(id: number, data: Partial<{ name: string; description: string; discountValue: number; isActive: boolean }>) {
  return prisma.promo.update({ where: { id }, data });
}

export async function deletePromo(id: number) {
  return prisma.promo.delete({ where: { id } });
}

export async function validatePromo(code: string, spend: number) {
  const promo = await prisma.promo.findUnique({ where: { code } });
  if (!promo) throw new Error('Promo not found');
  if (!promo.isActive) throw new Error('Promo is inactive');
  if (new Date() < promo.startDate) throw new Error('Promo not started yet');
  if (new Date() > promo.endDate) throw new Error('Promo expired');
  if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error('Promo usage limit reached');
  if (promo.minSpend && spend < promo.minSpend) throw new Error(`Minimum spend ${promo.minSpend} required`);

  let discount = 0;
  if (promo.discountType === 'PERCENTAGE') {
    discount = spend * (promo.discountValue / 100);
  } else {
    discount = promo.discountValue;
  }

  return { promo, discount };
}
