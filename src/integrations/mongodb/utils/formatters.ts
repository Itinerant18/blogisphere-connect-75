
import { Document, WithId } from 'mongodb';
import type { Post } from '../../../types/post';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a MongoDB blog document to the Post type used in the application
 */
export const formatPost = (post: WithId<Document>): Post => {
  // Safely cast document to avoid type conflicts
  const blogPost = post as Record<string, any>;
  const { _id, ...rest } = blogPost;
  
  // Author handling - ensure it's in the right format for Post type
  let authorFormatted: string | { name: string; avatar?: string };
  
  if (rest.author) {
    if (typeof rest.author === 'object' && rest.author !== null) {
      authorFormatted = rest.author;
    } else {
      authorFormatted = { name: String(rest.author) };
    }
  } else {
    authorFormatted = { name: 'Anonymous' };
  }
  
  // Ensure all dates are properly formatted as strings
  const created_at = rest.created_at 
    ? new Date(rest.created_at).toISOString() 
    : new Date().toISOString();
    
  const updated_at = rest.updated_at 
    ? new Date(rest.updated_at).toISOString() 
    : undefined;

  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    title: rest.title || 'Untitled',
    content: rest.content || '',
    excerpt: rest.excerpt || '',
    user_id: rest.user_id,
    author: authorFormatted,
    created_at,
    updated_at,
    published: rest.published !== false, // Default to true if not specified
    featured: !!rest.featured,
    tags: Array.isArray(rest.tags) ? rest.tags : [],
    slug: rest.slug || '',
    likes_count: rest.likes_count || 0,
    comments_count: rest.comments_count || 0,
    views_count: rest.views_count || 0,
    reading_time: rest.reading_time || 0,
    featured_image: rest.featured_image || '',
    // Compatibility with existing components
    date: created_at,
    likes: rest.likes_count || 0,
    comments: rest.comments_count || 0,
    image: rest.featured_image || '',
    image_url: rest.featured_image || '',
  } as Post;
};

/**
 * Format a comment document from MongoDB to use in the application
 */
export const formatComment = (comment: WithId<Document>) => {
  const commentDoc = comment as Record<string, any>;
  const { _id, ...rest } = commentDoc;
  
  // Handle author format
  let authorFormatted: string | { name: string; avatar?: string };
  if (rest.author) {
    if (typeof rest.author === 'object' && rest.author !== null) {
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
  const userDoc = user as Record<string, any>;
  const { _id, ...rest } = userDoc;
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined
  };
};
