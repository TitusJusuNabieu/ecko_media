import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const VALID_STATUSES = ['draft', 'published', 'archived'];
    if (statusParam && statusParam !== 'all' && !VALID_STATUSES.includes(statusParam)) {
      return NextResponse.json({ success: false, message: 'Invalid status value' }, { status: 400 });
    }
    const statusFilter = statusParam && statusParam !== 'all'
      ? { status: statusParam as 'draft' | 'published' | 'archived' }
      : {};

    const articles = await prisma.article.findMany({
      where: statusFilter,
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { title, slug, content, excerpt, featuredImage, featured_image, categoryId, category_id, tags, status } = await request.json();

    // Writers can only save drafts, not publish
    const resolvedStatus = (auth.role === 'writer' && status === 'published') ? 'draft' : (status || 'draft');

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || featured_image || null,
        authorId: auth.userId,
        categoryId: categoryId || category_id || null,
        tags: tags || [],
        status: resolvedStatus,
        publishedAt: resolvedStatus === 'published' ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: article, message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin' && auth.role !== 'editor') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id: rawId, title, slug, content, excerpt, featuredImage, featured_image, categoryId, category_id, tags, status } = await request.json();
    const id = parseInt(rawId);
    if (isNaN(id)) return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });

    const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true, authorId: true } });

    // Writers can only edit their own articles and cannot publish
    if (auth.role === 'writer') {
      if (existing?.authorId !== auth.userId) {
        return NextResponse.json({ success: false, message: 'Writers can only edit their own articles' }, { status: 403 });
      }
    }

    const resolvedStatus = (auth.role === 'writer' && status === 'published') ? 'draft' : status;

    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || featured_image || null,
        categoryId: categoryId || category_id || null,
        tags: tags || [],
        status: resolvedStatus,
        publishedAt: resolvedStatus === 'published' ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
      },
    });

    return NextResponse.json({ success: true, message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin' && auth.role !== 'editor') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await prisma.article.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
