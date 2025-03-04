import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import { CommentDocument, COLLECTIONS } from './schema';
import { v4 as uuidv4 } from 'uuid';

export const createComment = async (blog_id: string, user_id: string, content: string, parent_id?: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);

    const newComment: CommentDocument = {
      id: uuidv4(),
      blog_id,
      user_id,
      content,
      created_at: new Date(),
      updated_at: new Date(),
      parent_id,
      likes_count: 0,
    };

    const result = await collection.insertOne(newComment);

    return { success: true, insertedId: result.insertedId };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentById = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    const comment = await collection.findOne({ id: id });
    return comment as CommentDocument | null;
  } catch (error) {
    console.error(`Error getting comment by ID ${id}:`, error);
    throw error;
  }
};

export const getCommentsByBlogId = async (blog_id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    const comments = await collection.find({ blog_id: blog_id }).toArray();
    return comments as CommentDocument[];
  } catch (error) {
    console.error(`Error getting comments by blog ID ${blog_id}:`, error);
    throw error;
  }
};

export const getCommentsByUserId = async (user_id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    const comments = await collection.find({ user_id: user_id }).toArray();
    return comments as CommentDocument[];
  } catch (error) {
    console.error(`Error getting comments by user ID ${user_id}:`, error);
    throw error;
  }
};

export const updateComment = async (id: string, content: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    // Try to find the comment by id field first
    let comment = await collection.findOne({ id: id });
    let query: any = { id: id };
    
    // If not found, try to find by _id if it's a valid ObjectId
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
    
    const result = await collection.updateOne(
      query,
      { 
        $set: { 
          content,
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Comment not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    
    // Try to find the comment by id field first
    let comment = await collection.findOne({ id: id });
    let query: any = { id: id };
    
    // If not found, try to find by _id if it's a valid ObjectId
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
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      throw new Error('Comment not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    throw error;
  }
};

export const likeComment = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    const result = await collection.updateOne({ id: id }, { $inc: { likes_count: 1 } });

    if (result.matchedCount === 0) {
      throw new Error('Comment not found');
    }

    return { success: true };
  } catch (error) {
    console.error(`Error liking comment ${id}:`, error);
    throw error;
  }
};

export const unlikeComment = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.COMMENTS);
    const result = await collection.updateOne({ id: id }, { $inc: { likes_count: -1 } });

    if (result.matchedCount === 0) {
      throw new Error('Comment not found');
    }

    return { success: true };
  } catch (error) {
    console.error(`Error unliking comment ${id}:`, error);
    throw error;
  }
};
