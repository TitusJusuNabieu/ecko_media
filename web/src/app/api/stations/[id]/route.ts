import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Station, Program } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const stations = await query<Station>(
      "SELECT * FROM stations WHERE slug = ? AND is_active = 1",
      [id]
    );

    if (!stations || stations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Station not found' },
        { status: 404 }
      );
    }

    const station = stations[0];

    // Parse JSON fields
    if (typeof station.sub_genres === 'string') {
      station.sub_genres = JSON.parse(station.sub_genres || '[]');
    }
    if (typeof station.social_media === 'string') {
      station.social_media = JSON.parse(station.social_media || '{}');
    }

    // Get station programs
    const programs = await query<Program>(
      "SELECT * FROM programs WHERE station_id = ? AND is_active = 1",
      [station.id]
    );

    programs.forEach(program => {
      if (typeof program.schedule === 'string') {
        program.schedule = JSON.parse(program.schedule || '{}');
      }
    });

    station.programs = programs;

    return NextResponse.json({
      success: true,
      data: station
    });
  } catch (error) {
    console.error('Error fetching station:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
