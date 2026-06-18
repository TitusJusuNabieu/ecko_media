import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const newspapers = await prisma.newspaper.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: newspapers });
  } catch (error) {
    console.error('Error fetching newspapers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch newspapers' }, { status: 500 });
  }
}
