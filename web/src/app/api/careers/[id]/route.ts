import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title, department, location, employmentType, description,
      requirements, responsibilities, benefits, salary, applicationEmail, deadline, isActive,
    } = body;

    if (!title || !department || !location || !employmentType || !description || !requirements || !responsibilities || !applicationEmail) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await prisma.career.update({
      where: { id: parseInt(id) },
      data: {
        title, slug, department, location,
        employmentType, description, requirements, responsibilities,
        benefits: benefits || null,
        salary: salary || null,
        applicationEmail,
        deadline: deadline ? new Date(deadline) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, message: 'Career updated successfully' });
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.career.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
