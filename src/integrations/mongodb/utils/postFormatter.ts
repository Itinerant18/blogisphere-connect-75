
import type { Post } from '../../../types/post';
import { DocumentLike, safeGet, formatDate, formatAuthor, generateId } from './formatUtils';
import { v4 as uuidv4 } from 'uuid';

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
