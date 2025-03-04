
import { clientPromise } from '@/integrations/mongodb/client';

export const testMongoDBConnection = async () => {
  try {
    const client = await clientPromise;
    const db = client.db('blogisphere');
    
    // Try to ping the database
    await db.command({ ping: 1 });
    
    console.log('MongoDB connection successful!');
    
    // Try to access collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return {
      success: true,
      message: 'Connected to MongoDB successfully',
      collections: collections.map(c => c.name)
    };
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
