import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Article } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT a.*, ac.name as category_name, ac.slug as category_slug,
             u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN article_categories ac ON a.category_id = ac.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.status = 'published' AND a.published_at <= NOW()
    `;
    const values: any[] = [];

    if (category) {
      sql += " AND ac.slug = ?";
      values.push(category);
    }

    sql += ` ORDER BY a.published_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const articles = await query<Article>(sql, values);

    return NextResponse.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
