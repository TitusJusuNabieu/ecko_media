import { prisma } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set');
}
const JWT_SECRET = process.env.JWT_SECRET;

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: { email, isActive: true },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      avatar: true,
    },
  });
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    admin: 4,
    editor: 3,
    writer: 2,
    moderator: 1,
  };
  return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[requiredRole] ?? 0);
}

export async function verifyAuth(request: any): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;

    if (request.cookies?.get) {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      const authHeader = request.headers.get?.('authorization') ?? request.headers?.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await getUserById(payload.userId);
    if (!user || !user.isActive) return null;

    return payload;
  } catch {
    return null;
  }
}
