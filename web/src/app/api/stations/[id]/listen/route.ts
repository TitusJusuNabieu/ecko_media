import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.station.update({
      where: { id: parseInt(id) },
      data: { listenerCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: 'Listener count incremented' });
  } catch (error) {
    console.error('Error incrementing listener:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
