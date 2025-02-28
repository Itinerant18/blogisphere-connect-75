/**
 * MongoDB Schema Definitions
 * 
 * This file defines the schema structure for MongoDB collections.
 * While MongoDB is schema-less, defining these interfaces helps with TypeScript type checking.
 */

import { ObjectId } from 'mongodb';

// Blog Post Schema
export interface BlogDocument {
  _id?: ObjectId;
  title: string;
  content: string;
  user_id: string;
  username: string;
  featured: boolean;
  created_at: Date;
  updated_at?: Date;
  tags?: string[];
  image_url?: string;
  excerpt?: string;
  likes_count?: number;
  comments_count?: number;
  status?: 'draft' | 'published';
}

// User Profile Schema
export interface UserDocument {
  _id?: ObjectId;
  user_id: string; // Auth provider user ID
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at?: Date;
  role?: 'user' | 'admin';
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// Comment Schema
export interface CommentDocument {
  _id?: ObjectId;
  blog_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
  parent_id?: string; // For nested comments
}

// Like Schema
export interface LikeDocument {
  _id?: ObjectId;
  blog_id: string;
  user_id: string;
  created_at: Date;
}

// Tag Schema
export interface TagDocument {
  _id?: ObjectId;
  name: string;
  slug: string;
  count: number;
  created_at: Date;
}

// Collection Names
export const COLLECTIONS = {
  BLOGS: 'blogs',
  USERS: 'users',
  COMMENTS: 'comments',
  LIKES: 'likes',
  TAGS: 'tags'
};
