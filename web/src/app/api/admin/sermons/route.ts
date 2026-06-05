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

    const [listings] = await db.query<RowDataPacket[]>(
      'SELECT * FROM job_listings ORDER BY created_at DESC'
    );

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job listings' }, { status: 500 });
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
    const { title, department, location, employment_type, description, requirements, responsibilities, benefits, salary, application_email, apply_url, deadline } = body;

    if (!title || !department || !location || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO job_listings (title, department, location, employment_type, description, requirements, responsibilities, benefits, salary, application_email, apply_url, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, department, location, employment_type || 'Full-time', description, requirements || null, responsibilities || null, benefits || null, salary || null, application_email || null, apply_url || null, deadline || null]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: result.insertId, ...body }
    });
  } catch (error) {
    console.error('Error creating job listing:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job listing' }, { status: 500 });
  }
}
