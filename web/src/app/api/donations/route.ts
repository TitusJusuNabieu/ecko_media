import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept both mobile (email) and web (user_email) field names
    const userEmail = body.user_email || body.email || null;
    const amount = body.amount;
    const method = body.method;

    if (amount == null || amount <= 0 || !method) {
      return NextResponse.json({ success: false, message: 'amount and method are required' }, { status: 400 });
    }

    const referenceId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const donation = await prisma.donation.create({
      data: {
        userEmail,
        amount,
        method,
        referenceId,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, data: donation, message: 'Donation created successfully' });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

