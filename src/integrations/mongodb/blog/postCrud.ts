
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import type { Post } from '../../../types/post';
import { BlogDocument, COLLECTIONS } from '../schema';
import { v4 as uuidv4 } from 'uuid';
import { formatPost } from '../utils/formatters';

// Create a new blog post
export const createPost = async (post: Omit<Post, 'id' | '_id' | 'created_at' | 'updated_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const newPost: Partial<BlogDocument> = {
      id: uuidv4(),
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      featured_image: post.featured_image || post.image || post.image_url,
      user_id: post.user_id || '',
      created_at: new Date(),
      updated_at: new Date(),
      featured: post.featured || false,
      published: true,
      tags: post.tags || [],
      slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
      likes_count: post.likes_count || post.likes || 0,
      comments_count: post.comments_count || post.comments || 0,
      views_count: post.views_count || 0,
      reading_time: post.reading_time || Math.ceil(post.content.length / 1000),
      status: 'published'
    };
    
    if (typeof post.author === 'string') {
      newPost.author = { name: post.author };
    } else {
      newPost.author = post.author;
    }
    
    const result = await collection.insertOne(newPost as any);
    
    return { 
      id: result.insertedId.toString(),
      success: true 
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update a blog post
export const updatePost = async (id: string, updates: Partial<Post>) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    // Try to find the post by id field first
    let post = await collection.findOne({ id: id });
    let query: any = { id: id };
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!post) {
      try {
        const objectId = new ObjectId(id);
        post = await collection.findOne({ _id: objectId });
        if (post) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    const { id: _, created_at, ...updateData } = updates as any;
    
    // Convert author to object format if it's a string
    if (typeof updateData.author === 'string') {
      updateData.author = { name: updateData.author };
    }
    
    const result = await collection.updateOne(
      query,
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

// Delete a blog post (soft delete - mark as archived)
export const deletePost = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    // Try to find the post by id field first
    let post = await collection.findOne({ id: id });
    let query: any = { id: id };
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!post) {
      try {
        const objectId = new ObjectId(id);
        post = await collection.findOne({ _id: objectId });
        if (post) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Instead of hard delete, mark as archived
    const result = await collection.updateOne(
      query,
      { 
        $set: { 
          status: 'archived',
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Post not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

// Hard delete a blog post (admin only)
export const hardDeletePost = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    // Try both id and _id
    let query: any = { $or: [{ id: id }] };
    
    try {
      const objectId = new ObjectId(id);
      query = { $or: [{ id: id }, { _id: objectId }] };
    } catch (e) {
      // Not a valid ObjectId, which is fine
    }
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      throw new Error('Post not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error hard deleting post ${id}:`, error);
    throw error;
  }
};
