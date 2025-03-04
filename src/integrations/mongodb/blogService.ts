
/**
 * Blog Service
 * 
 * This file re-exports all blog-related functionality from their respective modules.
 * It serves as the main entry point for blog operations to maintain backward compatibility.
 */

export {
  // CRUD operations
  createPost,
  updatePost,
  deletePost,
  hardDeletePost,
  
  // Retrieval operations
  getAllPosts,
  getPostById,
  getPostsByUserId,
  getFeaturedPosts,
  getPostsByTag,
  
  // Search operations
  searchPosts
} from './blog';
