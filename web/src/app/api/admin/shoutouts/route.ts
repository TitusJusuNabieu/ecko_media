import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const shoutouts = await prisma.shoutout.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: shoutouts });
  } catch (error) {
    console.error('Error fetching shoutouts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch shoutouts' }, { status: 500 });
  }
}
