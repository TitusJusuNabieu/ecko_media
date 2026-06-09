import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const listings = await prisma.jobListing.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch job listings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin' && auth.role !== 'editor') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const {
      title, department, location, employment_type, employmentType,
      description, requirements, responsibilities, benefits, salary,
      application_email, applicationEmail, apply_url, applyUrl,
      deadline, isActive, is_active,
    } = await request.json();

    if (!title || !department || !location || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const listing = await prisma.jobListing.create({
      data: {
        title,
        department,
        location,
        employmentType: employmentType || employment_type || 'Full-time',
        description,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        benefits: benefits || null,
        salary: salary || null,
        applicationEmail: applicationEmail || application_email || null,
        applyUrl: applyUrl || apply_url || null,
        deadline: deadline ? new Date(deadline) : null,
        isActive: isActive ?? is_active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.error('Error creating job listing:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job listing' }, { status: 500 });
  }
}
