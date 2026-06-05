import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await query(
      "UPDATE stations SET listener_count = GREATEST(listener_count - 1, 0) WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Listener count decremented'
    });
  } catch (error) {
    console.error('Error decrementing listener:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
