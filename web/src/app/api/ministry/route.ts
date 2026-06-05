import { NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

interface MinistryInfo {
  id: number;
  name: string;
  mission?: string;
  vision?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
}

export async function GET() {
  try {
    const ministry = await queryOne<MinistryInfo>(
      `SELECT * FROM ministry_info LIMIT 1`
    );

    if (!ministry) {
      return NextResponse.json(
        { success: false, message: 'Ministry information not found' },
        { status: 404 }
      );
    }

    // Fetch leaders from users table for mobile app compatibility
    const leaders = await query(`
      SELECT 
        name, 
        role, 
        avatar as imageUrl,
        email,
        CONCAT('Team member at Ecko Media') as bio
      FROM users 
      WHERE role IN ('admin', 'editor')
      ORDER BY 
        CASE 
          WHEN role = 'admin' THEN 1
          WHEN role = 'editor' THEN 2
          ELSE 3
        END,
        created_at ASC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        ...ministry,
        leaders: leaders || []
      }
    });
  } catch (error) {
    console.error('Error fetching ministry info:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
