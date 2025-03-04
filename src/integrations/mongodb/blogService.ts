
import { ObjectId, Document, WithId } from 'mongodb';
import { getCollection } from './client';
import type { Post } from '../../types/post';
import { BlogDocument, COLLECTIONS } from './schema';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert MongoDB _id to id
const formatPost = (post: WithId<Document>): Post => {
  // Cast document to BlogDocument with unknown first to avoid direct type conflicts
  const blogPost = post as unknown as BlogDocument;
  const { _id, ...rest } = blogPost;
  
  return {
    id: rest.id || (_id ? _id.toString() : uuidv4()),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
    // Compatibility with existing components
    date: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    likes: rest.likes_count,
    comments: rest.comments_count,
    image: rest.featured_image,
    image_url: rest.featured_image,
    author: rest.author || 'Anonymous'
  } as Post;
};

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

// Get all blog posts
export const getAllPosts = async () => {
  try {
    const collection = await getCollection(COLLECTIONS.BLOGS);
    
    const posts = await collection
      .find({ status: { $ne: 'archived' } })
      .sort({ created_at: -1 })
      .toArray();
    
    return posts.map(post => formatPost(post));
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
    
    return posts.map(post => formatPost(post));
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

// Delete a blog post
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
    
    return posts.map(post => formatPost(post));
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
    
    return posts.map(post => formatPost(post));
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
    
    return posts.map(post => formatPost(post));
  } catch (error) {
    console.error(`Error getting posts by tag "${tag}":`, error);
    throw error;
  }
};
