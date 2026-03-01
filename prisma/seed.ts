import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bakesbang.ntbprov.go.id' },
    update: {},
    create: {
      email: 'admin@bakesbang.ntbprov.go.id',
      password: adminPassword,
      nama: 'Administrator BAKESBANGPOLDAGRI',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create pimpinan user
  const pimpinanPassword = await bcrypt.hash('pimpinan123', 10);
  const pimpinan = await prisma.user.upsert({
    where: { email: 'pimpinan@bakesbang.ntbprov.go.id' },
    update: {},
    create: {
      email: 'pimpinan@bakesbang.ntbprov.go.id',
      password: pimpinanPassword,
      nama: 'Pimpinan BAKESBANGPOLDAGRI',
      role: Role.PIMPINAN,
    },
  });
  console.log('✅ Pimpinan user created:', pimpinan.email);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
