import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface JobListingDB {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  salary?: string;
  application_email?: string;
  apply_url?: string;
  deadline?: string | null;
  is_active: number;
  created_at?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const listings = await query<JobListingDB>(
      `SELECT * FROM job_listings WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}