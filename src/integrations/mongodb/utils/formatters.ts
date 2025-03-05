
/**
 * Re-export all formatters from their individual modules
 */

// Utility functions
export { 
  safeGet, 
  formatDate, 
  formatAuthor, 
  generateId, 
  type DocumentLike 
} from './formatUtils';

// Post formatter
export { formatPost } from './postFormatter';

// Comment formatter
export { formatComment } from './commentFormatter';

// User formatter
export { formatUser } from './userFormatter';
