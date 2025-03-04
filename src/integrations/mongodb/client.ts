
import { MongoClient, ServerApiVersion } from 'mongodb';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const uri = import.meta.env.VITE_MONGODB_URI;

// Connection status tracker
let isConnected = false;
let mockClient: any = null;

if (!uri && !isBrowser) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
}

// Create a more comprehensive mock client for browser environments
const createMockClient = () => {
  console.log('Running in browser environment, using mock MongoDB client');
  
  // Return a mock client with all necessary methods
  mockClient = {
    connect: () => Promise.resolve(mockClient),
    db: (name: string) => ({
      collection: (collectionName: string) => ({
        find: () => ({
          sort: () => ({
            limit: () => ({
              toArray: () => Promise.resolve([])
            }),
            toArray: () => Promise.resolve([])
          }),
          toArray: () => Promise.resolve([])
        }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
        updateOne: () => Promise.resolve({ matchedCount: 1 }),
        deleteOne: () => Promise.resolve({ deletedCount: 1 }),
        countDocuments: () => Promise.resolve(0)
      })
    }),
    close: () => Promise.resolve()
  };
  
  return mockClient;
};

// Create a real client for server environments
const createServerClient = () => {
  if (!uri) {
    throw new Error('MongoDB connection string is missing');
  }
  
  try {
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
  } catch (err) {
    console.error('Error creating MongoDB client:', err);
    isConnected = false;
    throw err;
  }
};

// Always use mock client in browser
let clientPromise: Promise<any>;

if (isBrowser) {
  // For browser, immediately resolve with mock client
  clientPromise = Promise.resolve(createMockClient());
} else {
  // For server, try to connect to real MongoDB
  try {
    clientPromise = createServerClient();
  } catch (err) {
    console.error('Failed to initialize MongoDB client:', err);
    // Fallback to mock client if server connection fails
    clientPromise = Promise.resolve(createMockClient());
  }
}

export { clientPromise };

export async function getDatabase(dbName: string = 'blogisphere') {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    // Return a mock db in case of errors
    return createMockClient().db(dbName);
  }
}

export async function getCollection(collectionName: string, dbName: string = 'blogisphere') {
  try {
    const db = await getDatabase(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    // Return a mock collection in case of errors
    return createMockClient().db(dbName).collection(collectionName);
  }
}

export const getConnectionStatus = () => {
  return isBrowser ? false : isConnected;
};
