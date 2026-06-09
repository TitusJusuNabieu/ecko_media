import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept both mobile (artist) and web (artist_name) field names
    const requesterName = body.requester_name;
    const requesterEmail = body.requester_email;
    const songTitle = body.song_title;
    const artistName = body.artist_name || body.artist;
    const message = body.message;
    const stationId = body.station_id ? parseInt(body.station_id) : null;

    if (!requesterName || !songTitle || !artistName) {
      return NextResponse.json(
        { success: false, message: 'requester_name, song_title, and artist_name are required' },
        { status: 400 }
      );
    }

    const songRequest = await prisma.songRequest.create({
      data: {
        requesterName,
        requesterEmail: requesterEmail || null,
        songTitle,
        artistName,
        message: message || null,
        stationId: stationId || null,
      },
    });

    return NextResponse.json({ success: true, data: songRequest, message: 'Song request submitted successfully' });
  } catch (error) {
    console.error('Error creating song request:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
