import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const activeOnly = searchParams.get('active') !== 'false';
    const department = searchParams.get('department');

    const careers = await prisma.career.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(department ? { department } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: careers });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, department, location, employmentType, description,
      requirements, responsibilities, benefits, salary, applicationEmail, deadline, isActive,
    } = body;

    if (!title || !department || !location || !employmentType || !description || !requirements || !responsibilities || !applicationEmail) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const career = await prisma.career.create({
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

    return NextResponse.json({ success: true, data: career, message: 'Career posted successfully' });
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
