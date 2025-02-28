// Simple script to test MongoDB connection
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const uri = process.env.VITE_MONGODB_URI;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
  process.exit(1);
}

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log(`Connection string: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // List all databases
    const dbs = await client.db().admin().listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Create a test document in a test collection
    const testDb = client.db('blogisphere');
    const testCollection = testDb.collection('connection_test');
    
    const result = await testCollection.insertOne({
      test: true,
      message: 'Connection test successful',
      timestamp: new Date()
    });
    
    console.log(`\nInserted test document with ID: ${result.insertedId}`);
    console.log('Test completed successfully!');
    
    // Clean up - remove the test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('Test document removed.');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

testConnection().catch(console.error);
