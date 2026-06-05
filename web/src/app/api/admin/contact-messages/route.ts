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

    const [messages] = await db.query<RowDataPacket[]>(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
