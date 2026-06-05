import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Program } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stationId = searchParams.get('station_id');

    let sql = "SELECT * FROM programs WHERE is_active = 1";
    const values: any[] = [];

    if (stationId) {
      sql += " AND station_id = ?";
      values.push(stationId);
    }

    sql += " ORDER BY name ASC";

    const programs = await query<Program>(sql, values);

    programs.forEach(program => {
      if (typeof program.schedule === 'string') {
        program.schedule = JSON.parse(program.schedule || '{}');
      }
    });

    return NextResponse.json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
