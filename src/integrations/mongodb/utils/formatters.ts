
import { Document, WithId } from 'mongodb';
import type { Post } from '../../../types/post';
import { BlogDocument } from '../schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a MongoDB blog document to the Post type used in the application
 */
export const formatPost = (post: WithId<Document>): Post => {
  // Cast document to any first to avoid type conflicts
  const blogPost = post as any;
  const { _id, ...rest } = blogPost;
  
  // Author handling - ensure it's in the right format for Post type
  let authorFormatted: string | { name: string; avatar?: string };
  
  if (rest.author) {
    if (typeof rest.author === 'object') {
      authorFormatted = rest.author;
    } else {
      authorFormatted = { name: String(rest.author) };
    }
  } else {
    authorFormatted = { name: 'Anonymous' };
  }
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    author: authorFormatted,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
    // Compatibility with existing components
    date: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    likes: rest.likes_count || 0,
    comments: rest.comments_count || 0,
    image: rest.featured_image || '',
    image_url: rest.featured_image || '',
    excerpt: rest.excerpt || '',
  } as Post;
};

/**
 * Format a comment document from MongoDB to use in the application
 */
export const formatComment = (comment: WithId<Document>) => {
  const commentDoc = comment as any;
  const { _id, ...rest } = commentDoc;
  
  // Handle author format
  let authorFormatted: string | { name: string; avatar?: string };
  if (rest.author) {
    if (typeof rest.author === 'object') {
      authorFormatted = rest.author;
    } else {
      authorFormatted = { name: String(rest.author) };
    }
  } else {
    authorFormatted = { name: 'Anonymous' };
  }
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    author: authorFormatted,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
    likes_count: rest.likes_count || 0
  };
};

/**
 * Format a user document from MongoDB to use in the application
 */
export const formatUser = (user: WithId<Document>) => {
  const userDoc = user as any;
  const { _id, ...rest } = userDoc;
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined
  };
};
