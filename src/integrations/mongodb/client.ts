
/**
 * MongoDB Client - Browser Compatible Version
 * 
 * This file provides a compatibility layer for MongoDB operations in the browser.
 * It mocks the MongoDB client functionality for browser environments while
 * maintaining the same API surface for seamless integration.
 */

import { v4 as uuidv4 } from 'uuid';
import { COLLECTIONS } from './schema';

// Mock MongoDB collection for browser environments
class BrowserCollection {
  private collectionName: string;
  private mockData: Record<string, any>[] = [];

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    
    // Try to load existing data from localStorage
    try {
      const storedData = localStorage.getItem(`mongodb_${collectionName}`);
      if (storedData) {
        this.mockData = JSON.parse(storedData);
      }
    } catch (error) {
      console.error(`Error loading mock data for collection ${collectionName}:`, error);
    }
  }

  // Save current state to localStorage
  private saveState() {
    try {
      localStorage.setItem(`mongodb_${this.collectionName}`, JSON.stringify(this.mockData));
    } catch (error) {
      console.error(`Error saving mock data for collection ${this.collectionName}:`, error);
    }
  }

  // Find documents
  find(query: Record<string, any> = {}) {
    console.log(`[MongoDB Mock] Finding documents in ${this.collectionName} with query:`, query);
    
    // Filter results based on the query
    let results = [...this.mockData];
    
    // Process simple equality filters
    Object.entries(query).forEach(([key, value]) => {
      if (key === 'status' && value && typeof value === 'object' && '$ne' in value) {
        // Handle $ne operator
        const neValue = value.$ne;
        results = results.filter(doc => doc[key] !== neValue);
      } else if (key === 'tags' && value && typeof value === 'object' && '$in' in value) {
        // Handle $in operator for tags
        const inValues = value.$in;
        results = results.filter(doc => {
          const docTags = doc.tags || [];
          return Array.isArray(inValues) && inValues.some(tag => docTags.includes(tag));
        });
      } else if (key === '$or' && Array.isArray(value)) {
        // Handle $or operator for search queries
        results = results.filter(doc => {
          return value.some(condition => {
            for (const [condKey, condValue] of Object.entries(condition)) {
              if (typeof condValue === 'object' && condValue !== null && '$regex' in condValue) {
                const regex = new RegExp(String(condValue.$regex), condValue.$options || '');
                return regex.test(String(doc[condKey] || ''));
              }
              return doc[condKey] === condValue;
            }
            return false;
          });
        });
      } else if (key === '$and' && Array.isArray(value)) {
        // Handle $and operator
        results = results.filter(doc => {
          return value.every(condition => {
            if ('$or' in condition && Array.isArray(condition.$or)) {
              return condition.$or.some(orCond => {
                for (const [orKey, orValue] of Object.entries(orCond)) {
                  if (typeof orValue === 'object' && orValue !== null && '$regex' in orValue) {
                    const regex = new RegExp(String(orValue.$regex), orValue.$options || '');
                    return regex.test(String(doc[orKey] || ''));
                  }
                  return doc[orKey] === orValue;
                }
                return false;
              });
            }
            for (const [condKey, condValue] of Object.entries(condition)) {
              if (doc[condKey] !== condValue) return false;
            }
            return true;
          });
        });
      } else if (value !== undefined) {
        // Handle regular equality
        results = results.filter(doc => doc[key] === value);
      }
    });
    
    const cursor = {
      _data: results,
      toArray: () => Promise.resolve(cursor._data),
      sort: (sortOptions: Record<string, 1 | -1>) => {
        const [field, direction] = Object.entries(sortOptions)[0] || [];
        if (field) {
          cursor._data.sort((a, b) => {
            if (a[field] < b[field]) return direction === 1 ? -1 : 1;
            if (a[field] > b[field]) return direction === 1 ? 1 : -1;
            return 0;
          });
        }
        return cursor;
      },
      limit: (n: number) => {
        cursor._data = cursor._data.slice(0, n);
        return cursor;
      }
    };
    
    return cursor;
  }

  // Find a single document
  async findOne(query: Record<string, any> = {}) {
    console.log(`[MongoDB Mock] Finding one document in ${this.collectionName} with query:`, query);
    
    if (query.id) {
      return this.mockData.find(doc => doc.id === query.id) || null;
    }
    
    if (query._id) {
      return this.mockData.find(doc => 
        doc._id === query._id || doc._id?.toString() === query._id.toString()
      ) || null;
    }
    
    // Handle other query properties
    for (const doc of this.mockData) {
      let matches = true;
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) return doc;
    }
    
    return null;
  }

  // Insert documents
  async insertOne(document: Record<string, any>) {
    console.log(`[MongoDB Mock] Inserting document into ${this.collectionName}:`, document);
    
    // Ensure document has an _id
    const doc = { ...document };
    if (!doc._id) {
      doc._id = uuidv4();
    }
    
    // Add to mock data
    this.mockData.push(doc);
    this.saveState();
    
    return {
      insertedId: doc._id,
      acknowledged: true
    };
  }

  // Update documents
  async updateOne(
    filter: Record<string, any>,
    update: Record<string, any>,
    options: Record<string, any> = {}
  ) {
    console.log(`[MongoDB Mock] Updating document in ${this.collectionName} with filter:`, filter);
    
    const index = this.mockData.findIndex(doc => {
      for (const [key, value] of Object.entries(filter)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
    
    if (index === -1) {
      return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
    }
    
    // Process $set operator
    if (update.$set) {
      for (const [key, value] of Object.entries(update.$set)) {
        this.mockData[index][key] = value;
      }
    }
    
    // Process $inc operator
    if (update.$inc) {
      for (const [key, value] of Object.entries(update.$inc)) {
        if (typeof value === 'number') {
          this.mockData[index][key] = (this.mockData[index][key] || 0) + value;
        }
      }
    }
    
    this.saveState();
    
    return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
  }

  // Delete documents
  async deleteOne(filter: Record<string, any>) {
    console.log(`[MongoDB Mock] Deleting document from ${this.collectionName} with filter:`, filter);
    
    const initialLength = this.mockData.length;
    
    this.mockData = this.mockData.filter(doc => {
      for (const [key, value] of Object.entries(filter)) {
        if (doc[key] !== value) return true;
      }
      return false;
    });
    
    this.saveState();
    
    return {
      deletedCount: initialLength - this.mockData.length,
      acknowledged: true
    };
  }

  // Count documents
  async countDocuments(query: Record<string, any> = {}) {
    console.log(`[MongoDB Mock] Counting documents in ${this.collectionName} with query:`, query);
    
    let count = 0;
    for (const doc of this.mockData) {
      let matches = true;
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) count++;
    }
    
    return count;
  }
}

// Mock ObjectId for browser compatibility
export class ObjectId {
  private id: string;

  constructor(id?: string) {
    this.id = id || uuidv4();
  }

  toString() {
    return this.id;
  }

  equals(other: ObjectId) {
    return this.id === other.id;
  }
}

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

// Initialize collections with sample data if needed
export const initializeMockCollections = async () => {
  // Check if blogs collection is empty
  const blogsCollection = await getCollection(COLLECTIONS.BLOGS);
  const blogs = blogsCollection.find();
  const blogsArray = await blogs.toArray();
  
  if (blogsArray.length === 0) {
    // Add sample blog posts
    await blogsCollection.insertOne({
      id: uuidv4(),
      title: "Getting Started with MongoDB",
      content: "MongoDB is a document database designed for ease of development and scaling...",
      excerpt: "Learn the basics of MongoDB and how to get started.",
      user_id: "sample_user",
      author: { name: "Sample Author" },
      created_at: new Date(),
      updated_at: new Date(),
      published: true,
      featured: true,
      tags: ["MongoDB", "Database", "NoSQL"],
      slug: "getting-started-with-mongodb",
      likes_count: 5,
      comments_count: 2,
      views_count: 100,
      reading_time: 5,
      featured_image: "/placeholder.svg",
      category: "Technology"
    });

    await blogsCollection.insertOne({
      id: uuidv4(),
      title: "Web Development Best Practices",
      content: "Following best practices in web development is crucial for creating maintainable applications...",
      excerpt: "Essential tips for modern web development workflows.",
      user_id: "sample_user",
      author: { name: "Demo User" },
      created_at: new Date(),
      updated_at: new Date(),
      published: true,
      featured: true,
      tags: ["Web Development", "JavaScript", "Best Practices"],
      slug: "web-development-best-practices",
      likes_count: 10,
      comments_count: 3,
      views_count: 150,
      reading_time: 7,
      featured_image: "/placeholder.svg",
      category: "Technology"
    });
  }
};

// Initialize mock collections on module import
initializeMockCollections().catch(console.error);
