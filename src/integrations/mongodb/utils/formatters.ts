
import { Document, WithId } from 'mongodb';
import type { Post } from '../../../types/post';
import { BlogDocument } from '../schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a MongoDB blog document to the Post type used in the application
 */
export const formatPost = (post: WithId<Document>): Post => {
  // Cast document to BlogDocument with unknown first to avoid direct type conflicts
  const blogPost = post as unknown as BlogDocument;
  const { _id, ...rest } = blogPost;
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
    // Compatibility with existing components
    date: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    likes: rest.likes_count,
    comments: rest.comments_count,
    image: rest.featured_image,
    image_url: rest.featured_image,
    author: rest.author || 'Anonymous'
  } as Post;
};
