
/**
 * MongoDB Schema Definitions
 * 
 * This file defines the schema structure for MongoDB collections.
 * While MongoDB is schema-less, defining these interfaces helps with TypeScript type checking.
 */

import { ObjectId } from 'mongodb';

// MongoDB Collection Names
export const COLLECTIONS = {
  BLOGS: 'blogs',
  USERS: 'users',
  COMMENTS: 'comments',
  LIKES: 'likes',
  TAGS: 'tags'
};

// Common MongoDB Document interface
export interface MongoDocument {
  _id?: ObjectId;
}

// MongoDB Document Interfaces
export interface BlogDocument extends MongoDocument {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  user_id: string;
  author?: {
    name: string;
    avatar?: string;
  };
  created_at: Date;
  updated_at: Date;
  published: boolean;
  featured: boolean;
  tags: string[];
  slug: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  reading_time: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface UserDocument extends MongoDocument {
  id: string;
  user_id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
  role: 'user' | 'admin';
  social_links?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    email_notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface CommentDocument extends MongoDocument {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  parent_id?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  likes_count: number;
}

export interface LikeDocument extends MongoDocument {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: Date;
}

export interface TagDocument extends MongoDocument {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  created_at: Date;
  updated_at: Date;
}
