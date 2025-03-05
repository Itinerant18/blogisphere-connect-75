
import { Document, WithId } from 'mongodb';
import type { Post } from '../../../types/post';
import { v4 as uuidv4 } from 'uuid';

// Enhanced Document type that's more permissive
type DocumentLike = WithId<Document> | Record<string, any>;

/**
 * Safely extracts a specific field from a document with type checking
 */
const safeGet = <T>(doc: Record<string, any>, field: string, defaultValue: T): T => {
  if (field in doc && doc[field] !== undefined && doc[field] !== null) {
    return doc[field] as T;
  }
  return defaultValue;
};

/**
 * Safely formats a date field from various possible formats
 */
const formatDate = (dateValue: any): string => {
  if (!dateValue) {
    return new Date().toISOString();
  }
  
  try {
    if (dateValue instanceof Date) {
      return dateValue.toISOString();
    }
    
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toISOString();
    }
    
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toISOString();
    }
    
    // Default fallback
    return new Date().toISOString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date().toISOString();
  }
};

/**
 * Safely formats author information to the expected format
 */
const formatAuthor = (authorValue: any): string | { name: string; avatar?: string } => {
  if (!authorValue) {
    return { name: 'Anonymous' };
  }
  
  if (typeof authorValue === 'string') {
    return { name: authorValue };
  }
  
  if (typeof authorValue === 'object' && authorValue !== null) {
    // Ensure we have at least a name property
    if (!authorValue.name) {
      return { 
        ...authorValue,
        name: 'Anonymous' 
      };
    }
    return authorValue;
  }
  
  return { name: 'Anonymous' };
};

/**
 * Converts a MongoDB blog document to the Post type used in the application
 */
export const formatPost = (post: DocumentLike): Post => {
  try {
    // Ensure we're working with a plain object
    const blogPost = post as Record<string, any>;
    
    // Extract _id and id safely
    const postId = safeGet(blogPost, 'id', 
      blogPost._id ? blogPost._id.toString() : uuidv4());
    
    // Format author correctly
    const authorFormatted = formatAuthor(blogPost.author);
    
    // Handle dates
    const created_at = formatDate(blogPost.created_at);
    const updated_at = blogPost.updated_at ? formatDate(blogPost.updated_at) : undefined;
    
    // Ensure tags are properly formatted
    let tags = safeGet(blogPost, 'tags', []);
    if (!Array.isArray(tags)) {
      tags = [];
    }
    
    // Ensure boolean properties have the correct type
    const published = blogPost.published !== false; // Default to true
    const featured = !!blogPost.featured;
    
    // Build the formatted post
    return {
      id: postId,
      title: safeGet(blogPost, 'title', 'Untitled'),
      content: safeGet(blogPost, 'content', ''),
      excerpt: safeGet(blogPost, 'excerpt', ''),
      user_id: safeGet(blogPost, 'user_id', undefined),
      author: authorFormatted,
      created_at,
      updated_at,
      published,
      featured,
      tags,
      slug: safeGet(blogPost, 'slug', ''),
      likes_count: safeGet(blogPost, 'likes_count', 0),
      comments_count: safeGet(blogPost, 'comments_count', 0),
      views_count: safeGet(blogPost, 'views_count', 0),
      reading_time: safeGet(blogPost, 'reading_time', 0),
      featured_image: safeGet(blogPost, 'featured_image', ''),
      // Compatibility with existing components
      date: created_at,
      likes: safeGet(blogPost, 'likes_count', 0),
      comments: safeGet(blogPost, 'comments_count', 0),
      image: safeGet(blogPost, 'featured_image', '') || safeGet(blogPost, 'image', '') || safeGet(blogPost, 'image_url', ''),
      image_url: safeGet(blogPost, 'featured_image', '') || safeGet(blogPost, 'image', '') || safeGet(blogPost, 'image_url', ''),
      category: safeGet(blogPost, 'category', 'Uncategorized'),
    } as Post;
  } catch (error) {
    console.error("Error formatting post:", error);
    // Return a fallback minimal post if something goes wrong
    return {
      id: uuidv4(),
      title: "Error Loading Post",
      content: "",
      author: { name: "Unknown" },
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      image: "/placeholder.svg"
    } as Post;
  }
};

/**
 * Format a comment document from MongoDB to use in the application
 */
export const formatComment = (comment: DocumentLike) => {
  try {
    const commentDoc = comment as Record<string, any>;
    
    // Extract id safely
    const commentId = safeGet(commentDoc, 'id', 
      commentDoc._id ? commentDoc._id.toString() : uuidv4());
    
    // Format author correctly
    const authorFormatted = formatAuthor(commentDoc.author);
    
    // Handle dates
    const created_at = formatDate(commentDoc.created_at);
    const updated_at = commentDoc.updated_at ? formatDate(commentDoc.updated_at) : undefined;
    
    return {
      id: commentId,
      ...commentDoc,
      author: authorFormatted,
      created_at,
      updated_at,
      likes_count: safeGet(commentDoc, 'likes_count', 0)
    };
  } catch (error) {
    console.error("Error formatting comment:", error);
    // Return a fallback minimal comment
    return {
      id: uuidv4(),
      blog_id: "",
      content: "Error loading comment",
      author: { name: "Unknown" },
      created_at: new Date().toISOString(),
      likes_count: 0
    };
  }
};

/**
 * Format a user document from MongoDB to use in the application
 */
export const formatUser = (user: DocumentLike) => {
  try {
    const userDoc = user as Record<string, any>;
    
    // Extract id safely
    const userId = safeGet(userDoc, 'id', 
      userDoc._id ? userDoc._id.toString() : uuidv4());
    
    // Handle dates
    const created_at = formatDate(userDoc.created_at);
    const updated_at = userDoc.updated_at ? formatDate(userDoc.updated_at) : undefined;
    
    return {
      id: userId,
      ...userDoc,
      created_at,
      updated_at
    };
  } catch (error) {
    console.error("Error formatting user:", error);
    // Return a fallback minimal user
    return {
      id: uuidv4(),
      username: "unknown_user",
      created_at: new Date().toISOString()
    };
  }
};
