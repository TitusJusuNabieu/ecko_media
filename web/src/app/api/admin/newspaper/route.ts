import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const newspapers = await prisma.newspaper.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: newspapers });
  } catch (error) {
    console.error('Error fetching newspapers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch newspapers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!['admin', 'editor'].includes(auth.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { title, edition, coverImage, pdfUrl, description, publishedAt, isPublished } = await request.json();

    if (!title || !edition || !pdfUrl) {
      return NextResponse.json({ success: false, error: 'title, edition, and pdfUrl are required' }, { status: 400 });
    }

    const newspaper = await prisma.newspaper.create({
      data: {
        title,
        edition,
        coverImage: coverImage || null,
        pdfUrl,
        description: description || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        isPublished: isPublished !== false,
      },
    });

    return NextResponse.json({ success: true, data: newspaper });
  } catch (error) {
    console.error('Error creating newspaper:', error);
    return NextResponse.json({ success: false, error: 'Failed to create newspaper' }, { status: 500 });
  }
}
