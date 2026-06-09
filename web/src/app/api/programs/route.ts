import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const stationId = searchParams.get('station_id');

    const programs = await prisma.program.findMany({
      where: {
        isActive: true,
        ...(stationId ? { stationId: parseInt(stationId) } : {}),
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
