
import { supabase } from './client';
import type { Post } from '../../types/post';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new blog post
 */
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  try {
    const newPost = {
      title: post.title,
      content: post.content,
      image_url: post.featured_image || post.image || post.image_url,
      user_id: post.user_id || '',
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert(newPost)
      .select()
      .single();

    if (error) throw error;

    return { 
      id: data.id,
      success: true 
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Get all blog posts
 */
export const getAllPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => formatPost(post));
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  }
};

/**
 * Get a single blog post by ID
 */
export const getPostById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Post not found');

    // Increment view count (if we had this column)
    // We would need to add this column to the blogs table

    return formatPost(data);
  } catch (error) {
    console.error(`Error getting post by ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get posts by user ID
 */
export const getPostsByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error getting posts by user ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Get featured posts
 */
export const getFeaturedPosts = async (count: number = 3) => {
  try {
    // Note: This assumes we add a 'featured' column to the blogs table
    // For now, just return the latest posts
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    return data.map(post => formatPost(post));
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw error;
  }
};

/**
 * Get posts by tag
 */
export const getPostsByTag = async (tag: string) => {
  try {
    // Note: This would work better if we had a 'tags' column in the blogs table
    // For now, search in content for the tag
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .ilike('content', `%${tag}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error getting posts by tag "${tag}":`, error);
    throw error;
  }
};

/**
 * Search posts by title or content
 */
export const searchPosts = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    throw error;
  }
};

/**
 * Update a blog post
 */
export const updatePost = async (id: string, updates: Partial<Post>) => {
  try {
    const postUpdates = {
      title: updates.title,
      content: updates.content,
      image_url: updates.featured_image || updates.image || updates.image_url,
    };

    const { error } = await supabase
      .from('blogs')
      .update(postUpdates)
      .eq('id', id);

    if (error) throw error;

    return { success: true, id };
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a blog post
 */
export const deletePost = async (id: string) => {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

/**
 * Format a post from Supabase to use in the application
 */
const formatPost = (post: any): Post => {
  return {
    id: post.id,
    title: post.title || 'Untitled',
    content: post.content || '',
    excerpt: post.excerpt || post.title || 'Untitled',
    user_id: post.user_id,
    author: post.author || 'Unknown User',
    created_at: post.created_at,
    date: post.created_at, // For compatibility
    likes: 0, // These would need additional queries to count from the likes table
    comments: 0, // These would need additional queries to count from the comments table
    image: post.image_url || '/placeholder.svg',
    image_url: post.image_url || '/placeholder.svg',
    featured_image: post.image_url || '/placeholder.svg',
    tags: post.tags ? (Array.isArray(post.tags) ? post.tags : []) : [],
    category: 'Uncategorized', // Default category
  } as Post;
};

// Re-export for backward compatibility
export const hardDeletePost = deletePost;
