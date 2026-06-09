import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@eckomedia.sl' },
    update: {},
    create: {
      email: 'admin@eckomedia.sl',
      name: 'Admin',
      passwordHash,
      role: UserRole.admin,
      isActive: true,
    },
  });

  // Seed ministry info
  const existing = await prisma.ministryInfo.findFirst();
  if (!existing) {
    await prisma.ministryInfo.create({
      data: {
        name: 'Ecko Media',
        mission:
          'To "Reach the Unreached" with the Gospel, broadcasting messages of salvation, peace, and development to communities across Sierra Leone.',
        vision:
          'To be the leading Christian radio station in Sierra Leone, transforming lives through the power of the Gospel and quality broadcasting.',
        about:
          'Ecko Media is a Christian radio station based in Bo, Sierra Leone. Since 2003, we have been broadcasting the Good News, reaching communities with messages of hope, faith, and development.',
        address: 'Bo, Southern Province, Sierra Leone',
        phone: '+232 78 051 555, +232 99 051 555',
        email: 'info@eckomedia.sl',
        website: 'https://www.eckomedia.sl',
        logoUrl: '/images/logo.png',
      },
    });
  }

  // Seed default station
  const station = await prisma.station.upsert({
    where: { slug: 'ecko-media' },
    update: {},
    create: {
      name: 'Ecko Media 97.7 FM',
      slug: 'ecko-media',
      description:
        'Broadcasting the Good News from Bo, Sierra Leone. Your source for gospel music, ministry teachings, and community engagement.',
      tagline: 'Broadcasting the Good News',
      streamUrl: 'http://stream.eckomedia.sl:8000/live.mp3',
      genre: 'Gospel',
      subGenres: ['Contemporary Gospel', 'Traditional Gospel', 'Worship', 'Preaching'],
      language: 'English',
      country: 'Sierra Leone',
      isFeatured: true,
      socialMedia: {
        facebook: 'https://facebook.com/eckomedia',
        instagram: 'https://instagram.com/eckomedia',
        twitter: 'https://twitter.com/eckomedia',
        youtube: 'https://youtube.com/@eckomedia',
      },
    },
  });

  // Seed article categories
  const categories = ['News', 'Ministry', 'Events', 'Devotional', 'Community'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.articleCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  console.log('Database seeded successfully');
  console.log('Admin login: admin@eckomedia.sl / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
