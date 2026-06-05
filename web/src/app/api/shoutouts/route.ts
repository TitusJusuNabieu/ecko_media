import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { station_id, sender_name, recipient_name, message } = body;

    if (!station_id || !sender_name || !recipient_name || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO shoutouts (station_id, sender_name, recipient_name, message)
       VALUES (?, ?, ?, ?)`,
      [station_id, sender_name, recipient_name, message]
    );

    return NextResponse.json({
      success: true,
      message: 'Shoutout submitted successfully'
    });
  } catch (error) {
    console.error('Error creating shoutout:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
