import { MongoClient, ServerApiVersion } from 'mongodb';

// Use a polyfill or mock for browser environments
const mockPromisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Polyfill util.promisify for browser
if (typeof global !== 'undefined' && !global.util) {
  global.util = { promisify: mockPromisify };
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const uri = import.meta.env.VITE_MONGODB_URI;

// Connection status tracker
let isConnected = false;
let mockClient = null;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
  throw new Error('MongoDB connection string is missing');
}

// Create a mock client or real client based on environment
const createClient = () => {
  if (isBrowser) {
    console.log('Running in browser environment, using mock MongoDB client');
    
    // Return a mock client for browser environments
    mockClient = {
      connect: () => Promise.resolve(getMockClient()),
      db: (name) => ({
        collection: (collectionName) => ({
          find: () => ({
            sort: () => ({
              limit: () => ({
                toArray: () => Promise.resolve([])
              }),
              toArray: () => Promise.resolve([])
            })
          }),
          findOne: () => Promise.resolve(null),
          insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
          updateOne: () => Promise.resolve({ matchedCount: 1 }),
          deleteOne: () => Promise.resolve({ deletedCount: 1 }),
        })
      })
    };
    return Promise.resolve(mockClient);
  }
  
  // Use the actual MongoDB client for server environments
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });
  
  return client.connect()
    .then((connected) => {
      console.log('Connected to MongoDB successfully');
      isConnected = true;
      return connected;
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      isConnected = false;
      throw err;
    });
};

const getMockClient = () => mockClient;

// Keep track of the client promise globally
const globalWithMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<any>;
};

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = createClient();
}

export const clientPromise = globalWithMongo._mongoClientPromise;

export async function getDatabase(dbName: string = 'blogisphere') {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    throw error;
  }
}

export async function getCollection(collectionName: string, dbName: string = 'blogisphere') {
  try {
    const db = await getDatabase(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
}

export const getConnectionStatus = () => {
  return isConnected;
};
