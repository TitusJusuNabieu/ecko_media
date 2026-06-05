import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [programs] = await db.query<RowDataPacket[]>(
      'SELECT * FROM programs ORDER BY created_at DESC'
    );

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin' && user.role !== 'editor') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { station_id, name, slug, description, host_name, genre, schedule, is_active } = body;

    if (!station_id || !name || !slug || !host_name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const scheduleJson = schedule ? JSON.stringify(schedule) : null;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO programs (station_id, name, slug, description, host_name, genre, schedule, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [station_id, name, slug, description || null, host_name, genre || null, scheduleJson, is_active !== false]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: result.insertId, ...body }
    });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ success: false, error: 'Failed to create program' }, { status: 500 });
  }
}
