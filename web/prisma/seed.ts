import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Primary admin for handover
  const adminHash = await bcrypt.hash('EckoMedia2024!', 10);
  await prisma.user.upsert({
    where: { email: 'eckomedia3@gmail.com' },
    update: {},
    create: {
      email: 'eckomedia3@gmail.com',
      name: 'Ecko Media Admin',
      passwordHash: adminHash,
      role: UserRole.admin,
      isActive: true,
    },
  });

  // Fallback admin
  const fallbackHash = await bcrypt.hash('EckoAdmin2024!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@eckomedia.sl' },
    update: {},
    create: {
      email: 'admin@eckomedia.sl',
      name: 'Admin',
      passwordHash: fallbackHash,
      role: UserRole.admin,
      isActive: true,
    },
  });

  // Ministry info — upsert so re-running seed always applies latest content
  const existing = await prisma.ministryInfo.findFirst();
  if (!existing) {
    await prisma.ministryInfo.create({
      data: {
        name: 'Ecko Media',
        mission:
          'To connect every voice in Sierra Leone regardless of status, region, or political ideology — striving for excellence in media, not competition.',
        vision:
          'To be the most trusted independent media house in Sierra Leone — delivering radio, newspaper, and digital content that informs, inspires, and unites the nation.',
        about:
          'We connect voices as an independent media house based in the heart of Freetown, 48 Siaka Stevens Street. Our goal is to strive for excellence, not to compete, meeting the demands of daily challenges. We connect every voice regardless of status, region, political ideology and more. Our morning live sessions start at 7:30 AM daily Mon–Fri with many more programs throughout the day. From live 104.3 FM broadcasts to newspaper and online streaming, Ecko Media keeps Sierra Leone informed, inspired, and connected. Our motto is connecting voices, and every voice on Ecko counts.',
        address: '48 Siaka Stevens Street, Freetown, Sierra Leone',
        phone: '076946946',
        email: 'eckomedia3@gmail.com',
        website: 'https://www.eckomedia.sl',
        logoUrl: '/ecko-logo.svg',
      },
    });
  } else {
    await prisma.ministryInfo.update({
      where: { id: existing.id },
      data: {
        name: 'Ecko Media',
        mission:
          'To connect every voice in Sierra Leone regardless of status, region, or political ideology — striving for excellence in media, not competition.',
        vision:
          'To be the most trusted independent media house in Sierra Leone — delivering radio, newspaper, and digital content that informs, inspires, and unites the nation.',
        about:
          'We connect voices as an independent media house based in the heart of Freetown, 48 Siaka Stevens Street. Our goal is to strive for excellence, not to compete, meeting the demands of daily challenges. We connect every voice regardless of status, region, political ideology and more. Our morning live sessions start at 7:30 AM daily Mon–Fri with many more programs throughout the day. From live 104.3 FM broadcasts to newspaper and online streaming, Ecko Media keeps Sierra Leone informed, inspired, and connected. Our motto is connecting voices, and every voice on Ecko counts.',
        address: '48 Siaka Stevens Street, Freetown, Sierra Leone',
        phone: '076946946',
        email: 'eckomedia3@gmail.com',
        website: 'https://www.eckomedia.sl',
        logoUrl: '/ecko-logo.svg',
      },
    });
  }

  // Default station
  await prisma.station.upsert({
    where: { slug: 'ecko-media' },
    update: {
      name: 'Ecko Media 104.3 FM',
      description:
        'Connecting Voices — an independent media house from the heart of Freetown, Sierra Leone. Radio, newspaper, and online streaming.',
      tagline: 'Connecting Voices',
    },
    create: {
      name: 'Ecko Media 104.3 FM',
      slug: 'ecko-media',
      description:
        'Connecting Voices — an independent media house from the heart of Freetown, Sierra Leone. Radio, newspaper, and online streaming.',
      tagline: 'Connecting Voices',
      streamUrl: 'http://stream.eckomedia.sl:8000/live.mp3',
      genre: 'News & Talk',
      subGenres: ['News', 'Talk Shows', 'Community', 'Entertainment'],
      language: 'English',
      country: 'Sierra Leone',
      isFeatured: true,
      socialMedia: {
        facebook: 'https://facebook.com/eckomedia232',
        instagram: 'https://instagram.com/eckomedia',
        twitter: 'https://twitter.com/eckomedia',
        youtube: 'https://youtube.com/@eckomedia',
      },
    },
  });

  // Programs
  const programs = [
    {
      name: 'Ecko Morning Show',
      slug: 'ecko-morning-show',
      description: 'Start your day with Ecko — news, talk, and entertainment. Mon–Fri 7:30 AM.',
      hostName: 'Ecko Media Team',
      schedule: {
        Monday: { start: '7:30 AM', end: '9:00 AM' },
        Tuesday: { start: '7:30 AM', end: '9:00 AM' },
        Wednesday: { start: '7:30 AM', end: '9:00 AM' },
        Thursday: { start: '7:30 AM', end: '9:00 AM' },
        Friday: { start: '7:30 AM', end: '9:00 AM' },
      },
    },
    {
      name: 'News Paper Review',
      slug: 'news-paper-review',
      description: 'In-depth review of local and national newspapers. Tuesday & Thursday 12 PM.',
      hostName: 'Ecko News Desk',
      schedule: {
        Tuesday: { start: '12:00 PM', end: '1:00 PM' },
        Thursday: { start: '12:00 PM', end: '1:00 PM' },
      },
    },
    {
      name: 'Tell It to Ecko',
      slug: 'tell-it-to-ecko',
      description: 'Community voices, calls, and stories. Monday & Friday 7 PM.',
      hostName: 'Ecko Media Team',
      schedule: {
        Monday: { start: '7:00 PM', end: '8:00 PM' },
        Friday: { start: '7:00 PM', end: '8:00 PM' },
      },
    },
    {
      name: 'Lek U Culture',
      slug: 'lek-u-culture',
      description: 'Sierra Leonean culture, language, and heritage. Friday 1 PM.',
      hostName: 'Ecko Media Team',
      schedule: {
        Friday: { start: '1:00 PM', end: '2:00 PM' },
      },
    },
    {
      name: 'Governance Review',
      slug: 'governance-review',
      description: 'Analysis of governance, policy, and accountability. Saturday 11 AM.',
      hostName: 'Ecko News Desk',
      schedule: {
        Saturday: { start: '11:00 AM', end: '12:00 PM' },
      },
    },
    {
      name: 'Entertainment Hour',
      slug: 'entertainment-hour',
      description: 'Music, fun, and entertainment for the weekend. Saturday 1 PM.',
      hostName: 'Ecko Media Team',
      schedule: {
        Saturday: { start: '1:00 PM', end: '2:00 PM' },
      },
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {},
      create: program,
    });
  }

  // Article categories
  const categories = ['News', 'Community', 'Events', 'Entertainment', 'Politics'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.articleCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  console.log('Database seeded successfully');
  console.log('Primary admin:  eckomedia3@gmail.com  /  EckoMedia2024!');
  console.log('Fallback admin: admin@eckomedia.sl    /  EckoAdmin2024!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
