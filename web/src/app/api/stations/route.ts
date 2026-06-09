import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const stations = await prisma.station.findMany({
      where: {
        isActive: true,
        ...(genre ? { genre } : {}),
        ...(featured !== null ? { isFeatured: featured === 'true' } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { listenerCount: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: stations });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
