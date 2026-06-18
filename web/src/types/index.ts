export interface Station {
  id: number;
  name: string;
  slug: string;
  description: string;
  stream_url: string;
  logo_url?: string;
  genre: string;
  sub_genres?: string[];
  language: string;
  country?: string;
  city?: string;
  frequency?: string;
  tagline?: string;
  listener_count?: number;
  listenerCount?: number;
  social_media?: Record<string, string>;
  is_active: boolean;
  is_featured: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  created_at?: string;
  updated_at?: string;
  programs?: Program[];
}

export interface Program {
  id: number;
  station_id: number;
  name: string;
  slug: string;
  description: string;
  host_name: string;
  host_bio?: string;
  host_image_url?: string;
  schedule: Record<string, any>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  featured_image_url?: string;
  author_id: number;
  status: 'draft' | 'published' | 'archived';
  views: number;
  view_count: number;
  tags?: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  category?: ArticleCategory;
  author?: User;
}

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface User {
  id: number;
  username?: string;
  email: string;
  name?: string;
  full_name?: string;
  role: 'admin' | 'editor' | 'writer' | 'moderator' | 'user';
  avatar_url?: string;
  avatar?: string;
  bio?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  last_login?: string;
}

export interface SongRequest {
  id: number;
  station_id: number;
  requester_name: string;
  requester_email?: string;
  song_title: string;
  artist_name: string;
  message?: string;
  status: 'pending' | 'approved' | 'played' | 'rejected';
  created_at?: string;
}

export interface Shoutout {
  id: number;
  station_id: number;
  sender_name: string;
  recipient_name: string;
  message: string;
  status: 'pending' | 'approved' | 'read' | 'rejected';
  read_on_air: boolean;
  created_at?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance' | string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  salary?: string;
  applicationEmail?: string;
  applyUrl?: string;
  deadline?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface Donation {
  id: number;
  user_email?: string;
  amount: number;
  method: 'Orange' | 'Afrimoney' | 'Card' | 'Stripe' | 'PayPal';
  reference_id: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
}

export interface Career {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits?: string;
  salary?: string;
  applicationEmail: string;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MinistryInfo {
  id: number;
  name: string;
  mission?: string;
  vision?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}
