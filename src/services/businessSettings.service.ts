import { prisma } from '../config/prisma';

export async function getSettings() {
  const settings = await prisma.businessSettings.findFirst();
  return settings;
}

export async function upsertSettings(data: {
  shopName: string;
  address?: string;
  phone?: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  slotDuration?: number;
  allowBookingDays?: number;
}) {
  const existing = await prisma.businessSettings.findFirst();
  if (existing) {
    return prisma.businessSettings.update({
      where: { id: existing.id },
      data,
    });
  }
  return prisma.businessSettings.create({ data });
}
