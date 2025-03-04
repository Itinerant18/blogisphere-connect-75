
import { ObjectId, Document, WithId } from 'mongodb';
import { getCollection } from './client';
import { CommentDocument, COLLECTIONS } from './schema';

// Format comment document for frontend
const formatComment = (doc: WithId<Document>) => {
  // Cast to CommentDocument after an unknown cast to handle type conflicts
  const comment = doc as unknown as CommentDocument;
  const { _id, ...rest } = comment;
  
  return {
    id: rest.id || (_id ? _id.toString() : ''),
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
  };
};

// Create a new comment
export const createComment = async (commentData: Omit<CommentDocument, '_id' | 'created_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    const newComment = {
      ...commentData,
      created_at: new Date()
    };
    
    // Use as unknown as Document to match MongoDB's expected type
    const result = await collection.insertOne(newComment as unknown as Document);
    
    // Update comment count in the blog post
    const blogCollection = await getCollection(COLLECTIONS.BLOGS);
    await blogCollection.updateOne(
      { id: commentData.blog_id },
      { $inc: { comments_count: 1 } }
    );
    
    return { 
      success: true, 
      id: result.insertedId.toString() 
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Get comments for a blog post
export const getCommentsByBlogId = async (blogId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    const comments = await collection
      .find({ blog_id: blogId })
      .sort({ created_at: 1 })
      .toArray();
    
    return comments.map(doc => formatComment(doc));
  } catch (error) {
    console.error(`Error getting comments for blog ${blogId}:`, error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (id: string, content: string, userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    // Try to find by id field first
    let comment = await collection.findOne({ id });
    let query = { id };
    
    // If not found, try with ObjectId
    if (!comment) {
      try {
        const objectId = new ObjectId(id);
        comment = await collection.findOne({ _id: objectId });
        if (comment) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Cast to CommentDocument after an unknown cast
    const commentDoc = comment as unknown as CommentDocument;
    
    if (commentDoc.user_id !== userId) {
      throw new Error('Unauthorized: You can only edit your own comments');
    }
    
    const result = await collection.updateOne(
      query,
      { 
        $set: { 
          content,
          updated_at: new Date() 
        } 
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (id: string, userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    // Try to find by id field first
    let comment = await collection.findOne({ id });
    let query = { id };
    
    // If not found, try with ObjectId
    if (!comment) {
      try {
        const objectId = new ObjectId(id);
        comment = await collection.findOne({ _id: objectId });
        if (comment) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Cast to CommentDocument after an unknown cast
    const commentDoc = comment as unknown as CommentDocument;
    
    if (commentDoc.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments');
    }
    
    const result = await collection.deleteOne(query);
    
    // Update comment count in the blog post
    const blogCollection = await getCollection(COLLECTIONS.BLOGS);
    await blogCollection.updateOne(
      { id: commentDoc.blog_id },
      { $inc: { comments_count: -1 } }
    );
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    throw error;
  }
};

// Get comments by user ID
export const getCommentsByUserId = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    const comments = await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
    return comments.map(doc => formatComment(doc));
  } catch (error) {
    console.error(`Error getting comments for user ${userId}:`, error);
    throw error;
  }
};
