
import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import type { Post } from '../../types/post';
import { BlogDocument, COLLECTIONS } from './schema';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert MongoDB _id to id
const formatPost = (post: BlogDocument): Post => {
  const { _id, ...rest } = post;
  return {
    id: post.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
    // Compatibility with existing components
    date: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    likes: rest.likes_count,
    comments: rest.comments_count,
    image: rest.featured_image,
    image_url: rest.featured_image,
    author: typeof rest.author === 'object' ? rest.author.name : rest.author || 'Anonymous'
  } as Post;
};

// Create a new blog post
export const createPost = async (post: Omit<BlogDocument, '_id'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const newPost: BlogDocument = {
      ...post,
      id: post.id || uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
      featured: post.featured || false,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      views_count: post.views_count || 0,
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
      .find({ status: { $ne: 'archived' } })
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
      { _id: post._id },
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
    
    // Try to find the post by id field first
    let post = await collection.findOne({ id: id });
    let query = { id: id };
    
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

// Delete a blog post
export const deletePost = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    // Try to find the post by id field first
    let post = await collection.findOne({ id: id });
    let query = { id: id };
    
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
    let query = { $or: [{ id: id }] };
    
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
