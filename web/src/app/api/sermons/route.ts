import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const sermons = await prisma.sermon.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ success: true, data: sermons });
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
