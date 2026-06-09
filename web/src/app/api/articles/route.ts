import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        publishedAt: { lte: new Date() },
        ...(category
          ? { category: { slug: category } }
          : {}),
      },
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, email: true, avatar: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
