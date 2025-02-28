import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import { CommentDocument, COLLECTIONS } from './schema';

// Format comment document for frontend
const formatComment = (comment: CommentDocument) => {
  const { _id, ...rest } = comment;
  return {
    id: _id ? _id.toString() : '',
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
  };
};

// Create a new comment
export const createComment = async (commentData: Omit<CommentDocument, '_id' | 'created_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    const newComment: CommentDocument = {
      ...commentData,
      created_at: new Date()
    };
    
    const result = await collection.insertOne(newComment);
    
    // Update comment count in the blog post
    const blogCollection = await getCollection(COLLECTIONS.BLOGS);
    await blogCollection.updateOne(
      { _id: new ObjectId(commentData.blog_id) },
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
    
    return comments.map(formatComment);
  } catch (error) {
    console.error(`Error getting comments for blog ${blogId}:`, error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (id: string, content: string, userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      throw new Error('Invalid comment ID format');
    }
    
    // Verify the user owns the comment
    const comment = await collection.findOne({ _id: objectId });
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    if (comment.user_id !== userId) {
      throw new Error('Unauthorized: You can only edit your own comments');
    }
    
    const result = await collection.updateOne(
      { _id: objectId },
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
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      throw new Error('Invalid comment ID format');
    }
    
    // Verify the user owns the comment
    const comment = await collection.findOne({ _id: objectId });
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    if (comment.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments');
    }
    
    const result = await collection.deleteOne({ _id: objectId });
    
    // Update comment count in the blog post
    const blogCollection = await getCollection(COLLECTIONS.BLOGS);
    await blogCollection.updateOne(
      { _id: new ObjectId(comment.blog_id) },
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
    
    return comments.map(formatComment);
  } catch (error) {
    console.error(`Error getting comments for user ${userId}:`, error);
    throw error;
  }
};
