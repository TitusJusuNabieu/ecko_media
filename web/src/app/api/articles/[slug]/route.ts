import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Article extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: number | null;
  category_id: number | null;
  tags: string | string[] | null;
  status: string;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [articles] = await db.query<Article[]>(
      'SELECT * FROM articles WHERE slug = ? AND status = "published"',
      [slug]
    );

    if (articles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    const article = articles[0];

    // Increment view count
    await db.query(
      'UPDATE articles SET views = views + 1 WHERE id = ?',
      [article.id]
    );

    // Parse JSON fields
    if (article.tags && typeof article.tags === 'string') {
      try {
        article.tags = JSON.parse(article.tags) as string[];
      } catch (e) {
        article.tags = [] as any;
      }
    }

    return NextResponse.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
