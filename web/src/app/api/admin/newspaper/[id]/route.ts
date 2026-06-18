import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!['admin', 'editor'].includes(auth.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const newspaper = await prisma.newspaper.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.edition !== undefined && { edition: body.edition }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.pdfUrl !== undefined && { pdfUrl: body.pdfUrl }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.publishedAt !== undefined && { publishedAt: new Date(body.publishedAt) }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
    });

    return NextResponse.json({ success: true, data: newspaper });
  } catch (error) {
    console.error('Error updating newspaper:', error);
    return NextResponse.json({ success: false, error: 'Failed to update newspaper' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admins can delete editions' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.newspaper.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: 'Edition deleted' });
  } catch (error) {
    console.error('Error deleting newspaper:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete newspaper' }, { status: 500 });
  }
}
