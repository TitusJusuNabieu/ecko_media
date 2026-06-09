import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.station.updateMany({
      where: { id: parseInt(id), listenerCount: { gt: 0 } },
      data: { listenerCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true, message: 'Listener count decremented' });
  } catch (error) {
    console.error('Error decrementing listener:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
