import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept both mobile (from_name/to_name) and web (sender_name/recipient_name) field names
    const senderName = body.sender_name || body.from_name;
    const recipientName = body.recipient_name || body.to_name;
    const message = body.message;
    const stationId = body.station_id ? parseInt(body.station_id) : null;

    if (!senderName || !recipientName || !message) {
      return NextResponse.json(
        { success: false, message: 'sender_name, recipient_name, and message are required' },
        { status: 400 }
      );
    }

    const shoutout = await prisma.shoutout.create({
      data: {
        senderName,
        recipientName,
        message,
        stationId: stationId || null,
      },
    });

    return NextResponse.json({ success: true, data: shoutout, message: 'Shoutout submitted successfully' });
  } catch (error) {
    console.error('Error creating shoutout:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
