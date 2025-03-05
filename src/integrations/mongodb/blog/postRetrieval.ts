
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import type { Post } from '../../../types/post';
import { COLLECTIONS } from '../schema';
import { formatPost } from '../utils/formatters';

// Get all blog posts
export const getAllPosts = async () => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = collection
      .find({ status: { $ne: 'archived' } })
      .sort({ created_at: -1 });
    
    const postsArray = await posts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    let post;
    // Try to find by id field first
    post = await collection.findOne({ id: id });
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!post) {
      try {
        const objectId = new ObjectId(id);
        post = await collection.findOne({ _id: objectId });
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Increment view count
    await collection.updateOne(
      { id: post.id },
      { $inc: { views_count: 1 } }
    );
    
    return formatPost(post);
  } catch (error) {
    console.error(`Error getting post by ID ${id}:`, error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUserId = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = collection
      .find({ user_id: userId })
      .sort({ created_at: -1 });
    
    const postsArray = await posts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error getting posts by user ID ${userId}:`, error);
    throw error;
  }
};

// Get featured posts
export const getFeaturedPosts = async (count: number = 3) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = collection
      .find({ 
        featured: true,
        status: 'published'
      })
      .sort({ created_at: -1 })
      .limit(count);
    
    const postsArray = await posts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw error;
  }
};

// Get posts by tag
export const getPostsByTag = async (tag: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = collection
      .find({ 
        tags: { $in: [tag] },
        status: 'published'
      })
      .sort({ created_at: -1 });
    
    const postsArray = await posts.toArray();
    return postsArray.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error getting posts by tag "${tag}":`, error);
    throw error;
  }
};
