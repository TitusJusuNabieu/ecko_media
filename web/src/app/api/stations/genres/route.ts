import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      where: { isActive: true },
      select: { genre: true },
      distinct: ['genre'],
      orderBy: { genre: 'asc' },
    });

    return NextResponse.json({ success: true, data: stations.map((s) => s.genre) });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
