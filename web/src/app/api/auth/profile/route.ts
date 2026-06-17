import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { name, email, avatar, currentPassword, newPassword } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    // Check email not taken by another user
    const existing = await prisma.user.findFirst({
      where: { email: email.trim(), NOT: { id: auth.userId } },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email is already in use by another account' }, { status: 400 });
    }

    const updateData: any = { name: name.trim(), email: email.trim(), avatar: avatar?.trim() || null };

    // Password change: requires current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'Current password is required to set a new password' }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { passwordHash: true } });
      const valid = user && await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, message: 'New password must be at least 8 characters' }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });

    return NextResponse.json({ success: true, data: updated, message: 'Profile updated successfully' });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
