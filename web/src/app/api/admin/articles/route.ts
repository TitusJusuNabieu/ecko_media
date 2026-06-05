import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `
      SELECT a.*, ac.name as category_name, u.name as author_name
      FROM articles a
      LEFT JOIN article_categories ac ON a.category_id = ac.id
      LEFT JOIN users u ON a.author_id = u.id
    `;
    const values: any[] = [];

    if (status !== 'all') {
      sql += " WHERE a.status = ?";
      values.push(status);
    }

    sql += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const articles = await query(sql, values);

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, featured_image, category_id, tags, status } = body;

    const sql = `
      INSERT INTO articles (title, slug, content, excerpt, featured_image, author_id, category_id, tags, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const published_at = status === 'published' ? new Date() : null;
    const tagsJson = tags ? JSON.stringify(tags) : null;

    await query(sql, [
      title, slug, content, excerpt, featured_image,
      auth.userId, category_id, tagsJson, status, published_at
    ]);

    return NextResponse.json({ success: true, message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, content, excerpt, featured_image, category_id, tags, status } = body;

    let sql = `
      UPDATE articles
      SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
          category_id = ?, tags = ?, status = ?, updated_at = NOW()
    `;
    const values: any[] = [title, slug, content, excerpt, featured_image, category_id];
    values.push(tags ? JSON.stringify(tags) : null);
    values.push(status);

    if (status === 'published') {
      sql += ", published_at = COALESCE(published_at, NOW())";
    }

    sql += " WHERE id = ?";
    values.push(id);

    await query(sql, values);

    return NextResponse.json({ success: true, message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await query('DELETE FROM articles WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
