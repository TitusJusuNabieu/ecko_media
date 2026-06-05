import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [shoutouts] = await db.query<RowDataPacket[]>(
      'SELECT * FROM shoutouts ORDER BY created_at DESC'
    );

    return NextResponse.json({ success: true, data: shoutouts });
  } catch (error) {
    console.error('Error fetching shoutouts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch shoutouts' }, { status: 500 });
  }
}
