import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import type { Post } from '../../types/post';
import { BlogDocument, COLLECTIONS } from './schema';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert MongoDB _id to id
const formatPost = (post: BlogDocument): Post => {
  const { _id, ...rest } = post;
  return {
    id: _id ? _id.toString() : uuidv4(),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
  } as Post;
};

// Create a new blog post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const newPost: BlogDocument = {
      ...post,
      created_at: new Date(),
      featured: post.featured || false,
      likes_count: 0,
      comments_count: 0,
      status: 'published'
    };
    
    const result = await collection.insertOne(newPost);
    
    return { 
      id: result.insertedId.toString(),
      success: true 
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get all blog posts
export const getAllPosts = async () => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({ status: 'published' })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      throw new Error('Invalid post ID format');
    }
    
    const post = await collection.findOne({ _id: objectId });
    
    if (!post) {
      throw new Error('Post not found');
    }
    
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
    
    const posts = await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error(`Error getting posts by user ID ${userId}:`, error);
    throw error;
  }
};

// Update a blog post
export const updatePost = async (id: string, updates: Partial<Post>) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      throw new Error('Invalid post ID format');
    }
    
    const { id: _, created_at, ...updateData } = updates as any;
    
    const result = await collection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          ...updateData,
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Post not found');
    }
    
    return { success: true, id };
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

// Delete a blog post
export const deletePost = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      throw new Error('Invalid post ID format');
    }
    
    const result = await collection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      throw new Error('Post not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

// Get featured posts
export const getFeaturedPosts = async (count: number = 3) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({ 
        featured: true,
        status: 'published'
      })
      .sort({ created_at: -1 })
      .limit(count)
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw error;
  }
};

// Search posts by title or content
export const searchPosts = async (query: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({
        $and: [
          { status: 'published' },
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } },
              { tags: { $in: [query] } }
            ]
          }
        ]
      })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error(`Error searching posts for "${query}":`, error);
    throw error;
  }
};

// Get posts by tag
export const getPostsByTag = async (tag: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({ 
        tags: { $in: [tag] },
        status: 'published'
      })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(formatPost);
  } catch (error) {
    console.error(`Error getting posts by tag "${tag}":`, error);
    throw error;
  }
};
