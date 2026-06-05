import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { station_id, requester_name, requester_email, song_title, artist_name, message } = body;

    if (!station_id || !requester_name || !song_title || !artist_name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO song_requests (station_id, requester_name, requester_email, song_title, artist_name, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [station_id, requester_name, requester_email, song_title, artist_name, message]
    );

    return NextResponse.json({
      success: true,
      message: 'Song request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating song request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
