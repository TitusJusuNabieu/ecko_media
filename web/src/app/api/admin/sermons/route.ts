import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const sermons = await prisma.sermon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: sermons });
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sermons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin' && auth.role !== 'editor') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { title, preacher, description, audioUrl, audio_url, thumbnailUrl, thumbnail_url, duration, isActive, publishedAt } = await request.json();

    if (!title || !preacher) {
      return NextResponse.json({ success: false, error: 'title and preacher are required' }, { status: 400 });
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        preacher,
        description: description || null,
        audioUrl: audioUrl || audio_url || null,
        thumbnailUrl: thumbnailUrl || thumbnail_url || null,
        duration: duration || null,
        isActive: isActive !== false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, data: sermon });
  } catch (error) {
    console.error('Error creating sermon:', error);
    return NextResponse.json({ success: false, error: 'Failed to create sermon' }, { status: 500 });
  }
}
