import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = import.meta.env.VITE_MONGODB_URI;

if (!uri) {
  console.error('MongoDB connection string is missing! Please check your .env file.');
  throw new Error('MongoDB connection string is missing');
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
});
const globalWithMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};
if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = client.connect()
    .then((client) => {
      console.log('Connected to MongoDB successfully');
      return client;
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
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
