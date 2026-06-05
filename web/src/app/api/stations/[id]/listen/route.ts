import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await query(
      "UPDATE stations SET listener_count = listener_count + 1 WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Listener count incremented'
    });
  } catch (error) {
    console.error('Error incrementing listener:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
