import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const stations = await prisma.station.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: stations });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      name, slug, logoUrl, logo_url, description, tagline,
      streamUrl, stream_url, streamUrlHigh, stream_url_high,
      streamUrlLow, stream_url_low, genre, subGenres, sub_genres,
      language, country, socialMedia, social_media, isFeatured, is_featured,
    } = body;

    const station = await prisma.station.create({
      data: {
        name,
        slug,
        logoUrl: logoUrl || logo_url || null,
        description: description || null,
        tagline: tagline || null,
        streamUrl: streamUrl || stream_url,
        streamUrlHigh: streamUrlHigh || stream_url_high || null,
        streamUrlLow: streamUrlLow || stream_url_low || null,
        genre,
        subGenres: subGenres || sub_genres || [],
        language: language || 'English',
        country: country || 'Sierra Leone',
        socialMedia: socialMedia || social_media || {},
        isFeatured: isFeatured || is_featured || false,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: station, message: 'Station created successfully' });
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      id, name, slug, logoUrl, logo_url, description, tagline,
      streamUrl, stream_url, streamUrlHigh, stream_url_high,
      streamUrlLow, stream_url_low, genre, subGenres, sub_genres,
      language, country, socialMedia, social_media,
      isFeatured, is_featured, isActive, is_active,
    } = body;

    await prisma.station.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        logoUrl: logoUrl || logo_url || null,
        description: description || null,
        tagline: tagline || null,
        streamUrl: streamUrl || stream_url,
        streamUrlHigh: streamUrlHigh || stream_url_high || null,
        streamUrlLow: streamUrlLow || stream_url_low || null,
        genre,
        subGenres: subGenres || sub_genres || [],
        language: language || 'English',
        country: country || 'Sierra Leone',
        socialMedia: socialMedia || social_media || {},
        isFeatured: isFeatured ?? is_featured ?? false,
        isActive: isActive ?? is_active ?? true,
      },
    });

    return NextResponse.json({ success: true, message: 'Station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
