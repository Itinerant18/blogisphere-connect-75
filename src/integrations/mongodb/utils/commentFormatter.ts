
import { DocumentLike, safeGet, formatDate, formatAuthor, generateId } from './formatUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Format a comment document from MongoDB to use in the application
 */
export const formatComment = (comment: DocumentLike) => {
  try {
    const commentDoc = comment as Record<string, any>;
    
    // Extract id safely
    const commentId = safeGet(commentDoc, 'id', 
      commentDoc._id ? commentDoc._id.toString() : uuidv4());
    
    // Format author correctly
    const authorFormatted = formatAuthor(commentDoc.author);
    
    // Handle dates
    const created_at = formatDate(commentDoc.created_at);
    const updated_at = commentDoc.updated_at ? formatDate(commentDoc.updated_at) : undefined;
    
    return {
      id: commentId,
      ...commentDoc,
      author: authorFormatted,
      created_at,
      updated_at,
      likes_count: safeGet(commentDoc, 'likes_count', 0)
    };
  } catch (error) {
    console.error("Error formatting comment:", error);
    // Return a fallback minimal comment
    return {
      id: uuidv4(),
      blog_id: "",
      content: "Error loading comment",
      author: { name: "Unknown" },
      created_at: new Date().toISOString(),
      likes_count: 0
    };
  }
};
