import { prisma } from '../config/prisma';

export async function createBarber(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  specialty?: string;
  experience?: number;
  bio?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already exists');

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password, // should be hashed before calling this
      name: data.name,
      phone: data.phone,
      role: 'BARBER',
      barberProfile: {
        create: {
          specialty: data.specialty,
          experience: data.experience,
          bio: data.bio,
        },
      },
    },
    include: { barberProfile: true },
  });
  return user;
}

export async function listBarbers(includeInactive = false) {
  return prisma.barberProfile.findMany({
    where: includeInactive ? undefined : { isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      schedules: true,
      _count: { select: { bookings: true, portfolios: true } },
    },
  });
}

export async function getBarberById(id: number) {
  return prisma.barberProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      schedules: true,
      portfolios: true,
      bookings: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { service: true, customer: { select: { name: true } } },
      },
    },
  });
}

export async function updateBarber(id: number, data: Partial<{ specialty: string; experience: number; bio: string; isActive: boolean }>) {
  return prisma.barberProfile.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function upsertSchedule(barberId: number, schedules: { dayOfWeek: number; startTime: string; endTime: string; isDayOff: boolean }[]) {
  await prisma.barberSchedule.deleteMany({ where: { barberId } });
  await prisma.barberSchedule.createMany({
    data: schedules.map((s) => ({ ...s, barberId })),
  });
  return prisma.barberSchedule.findMany({ where: { barberId } });
}

export async function addPortfolio(barberId: number, imageUrl: string, caption?: string) {
  return prisma.portfolio.create({
    data: { barberId, imageUrl, caption },
  });
}

export async function removePortfolio(id: number) {
  return prisma.portfolio.delete({ where: { id } });
}

export async function getBarberAvailability(barberId: number, date: Date) {
  const dayOfWeek = date.getDay();
  const schedule = await prisma.barberSchedule.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });
  if (!schedule || schedule.isDayOff) return { available: false, slots: [] };

  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      bookingDate: date,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
    },
    select: { startTime: true, endTime: true },
  });

  // naive slot generation
  const slots: string[] = [];
  const [sh, sm] = schedule.startTime.split(':').map(Number);
  const [eh, em] = schedule.endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slotDuration = 30; // minutes

  for (let m = startMin; m < endMin; m += slotDuration) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const time = `${hh}:${mm}`;
    const busy = bookings.some((b: { startTime: string; endTime: string }) => {
      const [bs] = b.startTime.split(':').map(Number);
      const [be] = b.endTime.split(':').map(Number);
      const bsm = bs * 60;
      const bem = be * 60;
      const tm = m;
      return tm >= bsm && tm < bem;
    });
    if (!busy) slots.push(time);
  }

  return { available: true, schedule, slots };
}
