
import { Document, WithId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

// Enhanced Document type that's more permissive
export type DocumentLike = WithId<Document> | Record<string, any>;

/**
 * Safely extracts a specific field from a document with type checking
 */
export const safeGet = <T>(doc: Record<string, any>, field: string, defaultValue: T): T => {
  if (field in doc && doc[field] !== undefined && doc[field] !== null) {
    return doc[field] as T;
  }
  return defaultValue;
};

/**
 * Safely formats a date field from various possible formats
 */
export const formatDate = (dateValue: any): string => {
  if (!dateValue) {
    return new Date().toISOString();
  }
  
  try {
    if (dateValue instanceof Date) {
      return dateValue.toISOString();
    }
    
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toISOString();
    }
    
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toISOString();
    }
    
    // Default fallback
    return new Date().toISOString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date().toISOString();
  }
};

/**
 * Safely formats author information to the expected format
 */
export const formatAuthor = (authorValue: any): string | { name: string; avatar?: string } => {
  if (!authorValue) {
    return { name: 'Anonymous' };
  }
  
  if (typeof authorValue === 'string') {
    return { name: authorValue };
  }
  
  if (typeof authorValue === 'object' && authorValue !== null) {
    // Ensure we have at least a name property
    if (!authorValue.name) {
      return { 
        ...authorValue,
        name: 'Anonymous' 
      };
    }
    return authorValue;
  }
  
  return { name: 'Anonymous' };
};

/**
 * Generate a random ID if needed
 */
export const generateId = (existingId: any): string => {
  if (existingId) {
    return existingId.toString();
  }
  return uuidv4();
};
