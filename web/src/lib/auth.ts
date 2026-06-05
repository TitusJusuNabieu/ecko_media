import { query, queryOne } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  name: string;
  role: 'admin' | 'editor' | 'writer' | 'moderator';
  is_active: boolean;
  avatar?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  return await queryOne<User>(
    'SELECT * FROM users WHERE email = ? AND is_active = 1',
    [email]
  );
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  return await queryOne<User>(
    'SELECT id, email, name, role, is_active, avatar FROM users WHERE id = ?',
    [id]
  );
}

// Check permissions
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    admin: 4,
    editor: 3,
    writer: 2,
    moderator: 1
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
}

// Verify authentication from request
export async function verifyAuth(request: any): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;

    // Try to get token from cookie first
    if (request.cookies?.get) {
      token = request.cookies.get('auth-token')?.value;
    }

    // Fall back to Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return null;
    }

    // Verify user still exists and is active
    const user = await getUserById(payload.userId);
    if (!user || !user.is_active) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
