import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const donations = await prisma.donation.findMany({ orderBy: { createdAt: 'desc' } });

    return NextResponse.json({ success: true, data: donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch donations' }, { status: 500 });
  }
}
