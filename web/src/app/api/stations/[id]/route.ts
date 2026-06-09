import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const station = await prisma.station.findFirst({
      where: { slug: id, isActive: true },
      include: {
        programs: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!station) {
      return NextResponse.json({ success: false, message: 'Station not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: station });
  } catch (error) {
    console.error('Error fetching station:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
