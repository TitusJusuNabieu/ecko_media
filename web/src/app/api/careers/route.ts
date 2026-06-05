import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Career } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') !== 'false';
    const department = searchParams.get('department');

    let sql = `
      SELECT
        id,
        title,
        slug,
        department,
        location,
        employment_type AS employmentType,
        description,
        requirements,
        responsibilities,
        benefits,
        salary,
        application_email AS applicationEmail,
        deadline,
        is_active AS isActive,
        created_at AS createdAt
      FROM careers
      WHERE 1 = 1
    `;
    const values: any[] = [];

    if (activeOnly) {
      sql += ' AND is_active = 1';
    }

    if (department) {
      sql += ' AND department = ?';
      values.push(department);
    }

    sql += ' ORDER BY created_at DESC';

    const careers = await query<Career>(sql, values);

    return NextResponse.json({
      success: true,
      data: careers,
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      department,
      location,
      employmentType,
      description,
      requirements,
      responsibilities,
      benefits,
      salary,
      applicationEmail,
      deadline,
      isActive,
    } = body;

    if (
      !title ||
      !department ||
      !location ||
      !employmentType ||
      !description ||
      !requirements ||
      !responsibilities ||
      !applicationEmail
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const slug = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await query(
      `
      INSERT INTO careers (
        title,
        slug,
        department,
        location,
        employment_type,
        description,
        requirements,
        responsibilities,
        benefits,
        salary,
        application_email,
        deadline,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        slug,
        department,
        location,
        employmentType,
        description,
        requirements,
        responsibilities,
        benefits || null,
        salary || null,
        applicationEmail,
        deadline || null,
        isActive !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Career posted successfully',
    });
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
