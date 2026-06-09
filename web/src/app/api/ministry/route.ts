import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const ministry = await prisma.ministryInfo.findFirst();

    if (!ministry) {
      return NextResponse.json({ success: false, message: 'Ministry information not found' }, { status: 404 });
    }

    const leaders = await prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: ['admin', 'editor'] },
      },
      select: { name: true, role: true, avatar: true, email: true },
      orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
      take: 10,
    });

    const formattedLeaders = leaders.map((u) => ({
      name: u.name,
      role: u.role,
      imageUrl: u.avatar,
      email: u.email,
      bio: 'Team member at Ecko Media',
    }));

    return NextResponse.json({
      success: true,
      data: { ...ministry, leaders: formattedLeaders },
    });
  } catch (error) {
    console.error('Error fetching ministry info:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
