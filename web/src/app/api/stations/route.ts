import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Station } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let sql = "SELECT * FROM stations WHERE is_active = 1";
    const values: any[] = [];

    if (genre) {
      sql += " AND genre = ?";
      values.push(genre);
    }

    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    if (featured !== null) {
      sql += " AND is_featured = ?";
      values.push(featured === 'true' ? 1 : 0);
    }

    sql += " ORDER BY is_featured DESC, listener_count DESC, name ASC";

    const stations = await query<Station>(sql, values);

    // Parse JSON fields
    stations.forEach(station => {
      if (typeof station.sub_genres === 'string') {
        station.sub_genres = JSON.parse(station.sub_genres || '[]');
      }
      if (typeof station.social_media === 'string') {
        station.social_media = JSON.parse(station.social_media || '{}');
      }
    });

    return NextResponse.json({
      success: true,
      data: stations
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
