
/**
 * Supabase Integration
 * 
 * This file re-exports all Supabase-related functionality
 * to provide a clean import interface for the rest of the app.
 */

// Client
export { supabase } from './client';

// Blog Service
export {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  getFeaturedPosts,
  getPostsByTag,
  searchPosts,
  updatePost,
  deletePost,
  hardDeletePost,
} from './blogService';

// Types
export type { Database } from './types';
