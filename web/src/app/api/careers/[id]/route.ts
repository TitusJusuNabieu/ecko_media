import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      UPDATE careers
      SET
        title = ?,
        slug = ?,
        department = ?,
        location = ?,
        employment_type = ?,
        description = ?,
        requirements = ?,
        responsibilities = ?,
        benefits = ?,
        salary = ?,
        application_email = ?,
        deadline = ?,
        is_active = ?
      WHERE id = ?
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
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Career updated successfully',
    });
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM careers WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Career deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
