import { MongoClient, ServerApiVersion } from 'mongodb';

// Replace the placeholder with your MongoDB connection string
const uri = import.meta.env.VITE_MONGODB_URI || "mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
let globalWithMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;

// Export a module-scoped MongoClient promise
export { clientPromise };

// Helper function to get the database
export async function getDatabase(dbName: string = 'blogisphere') {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper function to get a collection
export async function getCollection(collectionName: string, dbName: string = 'blogisphere') {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}
