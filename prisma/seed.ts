import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/utils/password';

async function main() {
  // Create admin
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@barber.com' },
    update: {},
    create: {
      email: 'admin@barber.com',
      password: adminPassword,
      name: 'Admin Owner',
      role: 'ADMIN',
    },
  });

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 1 },
      update: {},
      create: { name: 'Haircut', description: 'Standard haircut', price: 50000, duration: 30, image: '' },
    }),
    prisma.service.upsert({
      where: { id: 2 },
      update: {},
      create: { name: 'Shave', description: 'Beard shave', price: 30000, duration: 20, image: '' },
    }),
    prisma.service.upsert({
      where: { id: 3 },
      update: {},
      create: { name: 'Haircut + Shave', description: 'Combo package', price: 70000, duration: 50, image: '' },
    }),
  ]);

  // Create barbers
  const barberPassword = await hashPassword('barber123');
  const barberUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'barber1@barber.com' },
      update: {},
      create: {
        email: 'barber1@barber.com',
        password: barberPassword,
        name: 'Andi',
        role: 'BARBER',
        barberProfile: { create: { specialty: 'Fade', experience: 3, bio: 'Expert in modern fades' } },
      },
      include: { barberProfile: true },
    }),
    prisma.user.upsert({
      where: { email: 'barber2@barber.com' },
      update: {},
      create: {
        email: 'barber2@barber.com',
        password: barberPassword,
        name: 'Budi',
        role: 'BARBER',
        barberProfile: { create: { specialty: 'Classic', experience: 5, bio: 'Classic cuts specialist' } },
      },
      include: { barberProfile: true },
    }),
  ]);

  // Set schedules for barbers
  for (const bu of barberUsers) {
    if (!bu.barberProfile) continue;
    const barberId = bu.barberProfile.id;
    await prisma.barberSchedule.deleteMany({ where: { barberId } });
    for (let d = 1; d <= 5; d++) {
      await prisma.barberSchedule.create({
        data: { barberId, dayOfWeek: d, startTime: '09:00', endTime: '21:00', isDayOff: false },
      });
    }
    await prisma.barberSchedule.create({
      data: { barberId, dayOfWeek: 0, startTime: '09:00', endTime: '21:00', isDayOff: true },
    });
    await prisma.barberSchedule.create({
      data: { barberId, dayOfWeek: 6, startTime: '09:00', endTime: '21:00', isDayOff: true },
    });
  }

  // Create resources
  const resources = await Promise.all([
    prisma.resource.upsert({ where: { id: 1 }, update: {}, create: { name: 'Chair A', type: 'CHAIR', capacity: 1 } }),
    prisma.resource.upsert({ where: { id: 2 }, update: {}, create: { name: 'Chair B', type: 'CHAIR', capacity: 1 } }),
    prisma.resource.upsert({ where: { id: 3 }, update: {}, create: { name: 'Station 1', type: 'STATION', capacity: 2 } }),
  ]);

  // Create inventory items
  await prisma.inventoryItem.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Razor Blade', unit: 'PIECE', quantity: 100, minStock: 10, unitCost: 5000 },
  });
  await prisma.inventoryItem.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Neck Strip', unit: 'ROLL', quantity: 20, minStock: 2, unitCost: 15000 },
  });

  // Create business settings
  await prisma.businessSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { shopName: 'BarberShop Pro', address: 'Jl. Raya No.1', phone: '08123456789', openingTime: '09:00', closingTime: '21:00' },
  });

  console.log('Seeded successfully');
  console.log({ admin, services, barberUsers, resources });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
