import { MongoClient, ServerApiVersion } from 'mongodb';

// Get MongoDB connection string from environment variables
const uri = import.meta.env.VITE_MONGODB_URI;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Maintain up to 10 socket connections
  connectTimeoutMS: 5000, // Give up initial connection after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});

let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
let globalWithMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = client.connect()
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}
clientPromise = globalWithMongo._mongoClientPromise;

// Export a module-scoped MongoClient promise
export { clientPromise };

// Helper function to get the database
export async function getDatabase(dbName: string = 'blogisphere') {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    throw error;
  }
}

// Helper function to get a collection
export async function getCollection(collectionName: string, dbName: string = 'blogisphere') {
  try {
    const db = await getDatabase(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
}
