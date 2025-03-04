
// Re-export all blog operations for clean imports

// CRUD operations
export { 
  createPost, 
  updatePost, 
  deletePost, 
  hardDeletePost 
} from './postCrud';

// Retrieval operations
export { 
  getAllPosts, 
  getPostById, 
  getPostsByUserId, 
  getFeaturedPosts, 
  getPostsByTag 
} from './postRetrieval';

// Search operations
export { 
  searchPosts 
} from './postSearch';
