import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findFirst({
      where: { slug, status: 'published' },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, email: true, avatar: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch article' }, { status: 500 });
  }
}
