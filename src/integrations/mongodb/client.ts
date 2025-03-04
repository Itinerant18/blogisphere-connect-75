import { MongoClient, ServerApiVersion } from 'mongodb';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const uri = import.meta.env.VITE_MONGODB_URI;

// Connection status tracker
let isConnected = false;
let mockClient = null;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
}

// Create a mock client for browser environments
const createMockClient = () => {
  console.log('Running in browser environment, using mock MongoDB client');
  
  // Return a mock client with all necessary methods
  return {
    connect: () => Promise.resolve(mockClient),
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
        countDocuments: () => Promise.resolve(0)
      })
    }),
    // Ensure we also close properly
    close: () => Promise.resolve()
  };
};

// Create a real client for server environments
const createServerClient = () => {
  if (!uri) {
    throw new Error('MongoDB connection string is missing');
  }
  
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
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

// Initialize the client based on environment
const initializeClient = () => {
  if (isBrowser) {
    mockClient = createMockClient();
    return Promise.resolve(mockClient);
  } else {
    return createServerClient();
  }
};

// Keep track of the client promise globally
const globalWithMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<any>;
};

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = initializeClient();
}

export const clientPromise = globalWithMongo._mongoClientPromise;

export async function getDatabase(dbName: string = 'blogisphere') {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    if (isBrowser) {
      // Return a mock db in browser environments when errors occur
      return (createMockClient()).db(dbName);
    }
    throw error;
  }
}

export async function getCollection(collectionName: string, dbName: string = 'blogisphere') {
  try {
    const db = await getDatabase(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    if (isBrowser) {
      // Return a mock collection in browser environments when errors occur
      return (createMockClient()).db(dbName).collection(collectionName);
    }
    throw error;
  }
}

export const getConnectionStatus = () => {
  return isConnected;
};
