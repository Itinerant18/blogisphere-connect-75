
import { DocumentLike, safeGet, formatDate, generateId } from './formatUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Format a user document from MongoDB to use in the application
 */
export const formatUser = (user: DocumentLike) => {
  try {
    const userDoc = user as Record<string, any>;
    
    // Extract id safely
    const userId = safeGet(userDoc, 'id', 
      userDoc._id ? userDoc._id.toString() : uuidv4());
    
    // Handle dates
    const created_at = formatDate(userDoc.created_at);
    const updated_at = userDoc.updated_at ? formatDate(userDoc.updated_at) : undefined;
    
    return {
      id: userId,
      ...userDoc,
      created_at,
      updated_at
    };
  } catch (error) {
    console.error("Error formatting user:", error);
    // Return a fallback minimal user
    return {
      id: uuidv4(),
      username: "unknown_user",
      created_at: new Date().toISOString()
    };
  }
};
