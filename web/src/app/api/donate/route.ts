import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const MONIME_API_KEY = process.env.MONIME_API_KEY!;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { amount, donorName, donorEmail, message } = await request.json();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    const amountInCents = Math.round(Number(amount) * 100);
    const referenceId = `ECK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // Create pending donation record
    const donation = await prisma.donation.create({
      data: {
        userEmail: donorEmail || null,
        amount: Number(amount),
        method: 'Monime',
        referenceId,
        status: 'pending',
      },
    });

    // Create Monime checkout session
    const monimeResponse = await fetch(`https://api.monime.io/spaces/${MONIME_SPACE_ID}/checkout-sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONIME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'SLE',
        description: `Donation to Ecko Media${message ? ` — ${message}` : ''}`,
        successUrl: `${APP_URL}/donate/success?ref=${referenceId}`,
        cancelUrl: `${APP_URL}/donate/cancel?ref=${referenceId}`,
        metadata: {
          reference_id: referenceId,
          donor_name: donorName || 'Anonymous',
          donor_email: donorEmail || '',
          donation_id: String(donation.id),
        },
      }),
    });

    if (!monimeResponse.ok) {
      const err = await monimeResponse.json().catch(() => ({}));
      console.error('Monime error:', err);
      return NextResponse.json({ success: false, error: 'Payment gateway error. Please try again.' }, { status: 502 });
    }

    const session = await monimeResponse.json();
    const checkoutUrl = session.url || session.checkoutUrl || session.data?.url;

    if (!checkoutUrl) {
      return NextResponse.json({ success: false, error: 'Could not get payment URL from gateway.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, checkoutUrl, referenceId });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
