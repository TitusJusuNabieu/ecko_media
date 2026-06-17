import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const programs = await prisma.program.findMany({
      include: { station: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!['admin', 'editor'].includes(auth.role)) {
      return NextResponse.json({ success: false, error: 'Editors and above can manage programs' }, { status: 403 });
    }

    const { stationId, station_id, name, slug, description, hostName, host_name, genre, schedule, isActive } = await request.json();
    const resolvedStationId = stationId || station_id;
    const resolvedHostName = hostName || host_name;

    if (!resolvedStationId || !name || !slug || !resolvedHostName) {
      return NextResponse.json({ success: false, error: 'stationId, name, slug, and hostName are required' }, { status: 400 });
    }

    const program = await prisma.program.create({
      data: {
        stationId: parseInt(resolvedStationId),
        name,
        slug,
        description: description || null,
        hostName: resolvedHostName,
        genre: genre || null,
        schedule: schedule || {},
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ success: false, error: 'Failed to create program' }, { status: 500 });
  }
}
