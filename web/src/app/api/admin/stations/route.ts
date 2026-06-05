import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name, slug, logo_url, description, tagline, stream_url,
      stream_url_high, stream_url_low, genre, sub_genres,
      language, country, social_media, is_featured
    } = body;

    const sql = `
      INSERT INTO stations (
        name, slug, logo_url, description, tagline, stream_url,
        stream_url_high, stream_url_low, genre, sub_genres,
        language, country, social_media, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    await query(sql, [
      name, slug, logo_url, description, tagline, stream_url,
      stream_url_high, stream_url_low, genre,
      JSON.stringify(sub_genres || []),
      language, country,
      JSON.stringify(social_media || {}),
      is_featured ? 1 : 0
    ]);

    return NextResponse.json({ success: true, message: 'Station created successfully' });
  } catch (error) {
    console.error('Error creating station:', error);
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
    const {
      id, name, slug, logo_url, description, tagline, stream_url,
      stream_url_high, stream_url_low, genre, sub_genres,
      language, country, social_media, is_featured, is_active
    } = body;

    const sql = `
      UPDATE stations SET
        name = ?, slug = ?, logo_url = ?, description = ?, tagline = ?,
        stream_url = ?, stream_url_high = ?, stream_url_low = ?,
        genre = ?, sub_genres = ?, language = ?, country = ?,
        social_media = ?, is_featured = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [
      name, slug, logo_url, description, tagline, stream_url,
      stream_url_high, stream_url_low, genre,
      JSON.stringify(sub_genres || []),
      language, country,
      JSON.stringify(social_media || {}),
      is_featured ? 1 : 0,
      is_active ? 1 : 0,
      id
    ]);

    return NextResponse.json({ success: true, message: 'Station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
