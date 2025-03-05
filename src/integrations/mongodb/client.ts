
/**
 * MongoDB Client - Browser Compatible Version
 * 
 * This file provides a compatibility layer for MongoDB operations in the browser.
 * It imports specialized modules for better code organization.
 */

import { BrowserCollection } from './browser/browserCollection';
import { initializeMockCollections } from './browser/initialization';
export { ObjectId } from './utils/objectId';

// Collection cache to avoid recreating collections
const collectionsCache: Record<string, BrowserCollection> = {};

// Get a MongoDB collection
export const getCollection = async (collectionName: string) => {
  console.log(`[MongoDB Mock] Getting collection: ${collectionName}`);

  if (!collectionsCache[collectionName]) {
    collectionsCache[collectionName] = new BrowserCollection(collectionName);
  }

  return collectionsCache[collectionName];
};

// Client Promise for compatibility with server-side code
export const clientPromise = Promise.resolve({
  db: () => ({
    collection: (name: string) => {
      if (!collectionsCache[name]) {
        collectionsCache[name] = new BrowserCollection(name);
      }
      return collectionsCache[name];
    }
  }),
  close: () => Promise.resolve()
});

// Connect to MongoDB
export const connectToMongoDB = async () => {
  console.log("[MongoDB Mock] Using browser-compatible MongoDB mock");
  return {
    db: () => ({
      collection: (name: string) => {
        if (!collectionsCache[name]) {
          collectionsCache[name] = new BrowserCollection(name);
        }
        return collectionsCache[name];
      }
    }),
    close: () => Promise.resolve()
  };
};

// Check MongoDB connection
export const checkMongoDBConnection = async () => {
  return { success: true, message: "Using MongoDB browser mock" };
};

// Initialize mock collections on module import
initializeMockCollections().catch(console.error);
