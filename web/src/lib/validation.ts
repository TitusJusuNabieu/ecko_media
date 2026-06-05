import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'editor', 'writer', 'moderator']),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['admin', 'editor', 'writer', 'moderator']).optional(),
  is_active: z.boolean().optional(),
});

// Article validation schemas
export const createArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(500),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().max(500).optional(),
  category_id: z.number().int().positive(),
  featured_image: z.string().url().optional(),
  is_published: z.boolean().default(false),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Song request validation
export const songRequestSchema = z.object({
  listener_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  song_title: z.string().min(2, 'Song title must be at least 2 characters').max(255),
  artist: z.string().max(255).optional(),
  message: z.string().max(500).optional(),
});

// Shoutout validation
export const shoutoutSchema = z.object({
  from_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  to_name: z.string().min(2, 'Recipient name must be at least 2 characters').max(100),
  message: z.string().min(5, 'Message must be at least 5 characters').max(500),
  phone: z.string().max(20).optional(),
});

// Donation validation
export const donationSchema = z.object({
  donor_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  message: z.string().max(500).optional(),
  is_anonymous: z.boolean().default(false),
});

// Station validation
export const createStationSchema = z.object({
  name: z.string().min(2, 'Station name must be at least 2 characters').max(255),
  slug: z.string().min(2).max(255),
  stream_url: z.string().url('Invalid stream URL'),
  genre: z.string().min(2).max(100),
  description: z.string().max(5000).optional(),
  language: z.string().max(50).default('English'),
  country: z.string().max(100).default('Sierra Leone'),
});

// Program validation
export const createProgramSchema = z.object({
  station_id: z.number().int().positive(),
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  host_name: z.string().min(2).max(255),
  description: z.string().max(5000).optional(),
  schedule: z.array(z.object({
    day: z.number().int().min(0).max(6),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })).optional(),
});

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

// Validate and sanitize input
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
