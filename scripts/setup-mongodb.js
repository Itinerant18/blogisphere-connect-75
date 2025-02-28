// Script to set up MongoDB database and collections
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define collection names
const COLLECTIONS = {
  BLOGS: 'blogs',
  USERS: 'users',
  COMMENTS: 'comments',
  LIKES: 'likes',
  TAGS: 'tags'
};

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const uri = process.env.VITE_MONGODB_URI;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
  process.exit(1);
}

async function setupDatabase() {
  console.log('Setting up MongoDB database...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Create database if it doesn't exist (MongoDB creates it automatically when we use it)
    const db = client.db('blogisphere');
    console.log('Using database: blogisphere');
    
    // Create collections if they don't exist
    for (const collectionName of Object.values(COLLECTIONS)) {
      const collections = await db.listCollections({ name: collectionName }).toArray();
      
      if (collections.length === 0) {
        console.log(`Creating collection: ${collectionName}`);
        await db.createCollection(collectionName);
        console.log(`Collection ${collectionName} created successfully`);
      } else {
        console.log(`Collection ${collectionName} already exists`);
      }
    }
    
    // Create indexes for blogs collection
    console.log(`Creating indexes for ${COLLECTIONS.BLOGS} collection...`);
    await db.collection(COLLECTIONS.BLOGS).createIndexes([
      { key: { user_id: 1 }, name: 'user_id_index' },
      { key: { created_at: -1 }, name: 'created_at_index' },
      { key: { featured: 1, created_at: -1 }, name: 'featured_created_at_index' },
      { key: { tags: 1 }, name: 'tags_index' },
      { key: { title: 'text', content: 'text' }, name: 'text_search_index' },
      { key: { slug: 1 }, name: 'slug_index', unique: true }
    ]);
    
    // Create indexes for users collection
    console.log(`Creating indexes for ${COLLECTIONS.USERS} collection...`);
    await db.collection(COLLECTIONS.USERS).createIndexes([
      { key: { user_id: 1 }, name: 'user_id_index', unique: true },
      { key: { username: 1 }, name: 'username_index', unique: true },
      { key: { email: 1 }, name: 'email_index', unique: true }
    ]);
    
    // Create indexes for comments collection
    console.log(`Creating indexes for ${COLLECTIONS.COMMENTS} collection...`);
    await db.collection(COLLECTIONS.COMMENTS).createIndexes([
      { key: { blog_id: 1, created_at: 1 }, name: 'blog_id_created_at_index' },
      { key: { user_id: 1 }, name: 'user_id_index' },
      { key: { parent_id: 1 }, name: 'parent_id_index' }
    ]);
    
    // Create indexes for likes collection
    console.log(`Creating indexes for ${COLLECTIONS.LIKES} collection...`);
    await db.collection(COLLECTIONS.LIKES).createIndexes([
      { key: { blog_id: 1, user_id: 1 }, name: 'blog_user_index', unique: true },
      { key: { user_id: 1 }, name: 'user_id_index' }
    ]);
    
    // Create indexes for tags collection
    console.log(`Creating indexes for ${COLLECTIONS.TAGS} collection...`);
    await db.collection(COLLECTIONS.TAGS).createIndexes([
      { key: { slug: 1 }, name: 'slug_index', unique: true },
      { key: { count: -1 }, name: 'count_index' }
    ]);
    
    console.log('MongoDB database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up MongoDB database:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

setupDatabase().catch(console.error);
