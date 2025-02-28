import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import type { Post } from '../../types/post';

const COLLECTION_NAME = 'blogs';

// Helper function to convert MongoDB _id to id
const formatPost = (post: any): Post => {
  const { _id, ...rest } = post;
  return {
    id: _id.toString(),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
  };
};

// Create a new blog post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const result = await collection.insertOne({
      ...post,
      created_at: new Date(),
    });
    
    return { id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get all blog posts
export const getAllPosts = async () => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const posts = await collection
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const post = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!post) return null;
    
    return formatPost(post);
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUserId = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const posts = await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Update a blog post
export const updatePost = async (id: string, updates: Partial<Post>) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a blog post
export const deletePost = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Get featured posts
export const getFeaturedPosts = async (count: number = 3) => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    const posts = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(count)
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw error;
  }
};
