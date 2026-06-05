import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

interface Donation {
  id: number;
  user_email?: string;
  amount: number;
  method: string;
  reference_id: string;
  status: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_email, amount, method } = body;

    if (!amount || !method) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique reference ID
    const reference_id = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await query(
      `INSERT INTO donations (user_email, amount, method, reference_id, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [user_email || null, amount, method, reference_id]
    );

    // Get the created donation
    const donation = await queryOne<Donation>(
      `SELECT * FROM donations WHERE reference_id = ?`,
      [reference_id]
    );

    return NextResponse.json({
      success: true,
      data: donation,
      message: 'Donation created successfully'
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const donations = await query<Donation>(
      `SELECT * FROM donations 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
