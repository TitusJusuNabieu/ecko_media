import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const genres = await query<{ genre: string }>(
      "SELECT DISTINCT genre FROM stations WHERE is_active = 1 ORDER BY genre"
    );

    return NextResponse.json({
      success: true,
      data: genres.map(g => g.genre)
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
