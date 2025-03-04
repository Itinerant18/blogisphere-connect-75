
import { ObjectId, Document, WithId } from 'mongodb';
import { getCollection } from './client';
import { UserDocument, COLLECTIONS } from './schema';

// Format user document for frontend
const formatUser = (doc: WithId<Document>) => {
  // Cast to UserDocument after an unknown cast to handle type conflicts
  const user = doc as unknown as UserDocument;
  const { _id, ...rest } = user;
  
  return {
    id: _id ? _id.toString() : rest.id || rest.user_id,
    ...rest,
    created_at: rest.created_at ? new Date(rest.created_at).toISOString() : new Date().toISOString(),
    updated_at: rest.updated_at ? new Date(rest.updated_at).toISOString() : undefined,
  };
};

// Create or update user profile
export const createOrUpdateUser = async (userData: Omit<UserDocument, '_id' | 'created_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    // Check if user already exists
    const existingUser = await collection.findOne({ user_id: userData.user_id });
    
    if (existingUser) {
      // Update existing user
      const { user_id, ...updateData } = userData;
      
      await collection.updateOne(
        { user_id },
        { 
          $set: { 
            ...updateData,
            updated_at: new Date() 
          } 
        }
      );
      
      return { 
        success: true, 
        id: existingUser._id.toString(),
        isNew: false
      };
    } else {
      // Create new user
      const newUser = {
        ...userData,
        created_at: new Date(),
        role: userData.role || 'user'
      };
      
      // Use as unknown as Document to match MongoDB's expected type
      const result = await collection.insertOne(newUser as unknown as Document);
      
      return { 
        success: true, 
        id: result.insertedId.toString(),
        isNew: true
      };
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

// Get user by auth provider user ID
export const getUserByAuthId = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const user = await collection.findOne({ user_id: userId });
    
    if (!user) return null;
    
    return formatUser(user);
  } catch (error) {
    console.error(`Error getting user by auth ID ${userId}:`, error);
    throw error;
  }
};

// Get user by MongoDB ID
export const getUserById = async (id: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    let user;
    
    // Try to find by id field first
    user = await collection.findOne({ id });
    
    // If not found, try with ObjectId
    if (!user) {
      try {
        const objectId = new ObjectId(id);
        user = await collection.findOne({ _id: objectId });
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!user) return null;
    
    return formatUser(user);
  } catch (error) {
    console.error(`Error getting user by ID ${id}:`, error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const user = await collection.findOne({ username });
    
    if (!user) return null;
    
    return formatUser(user);
  } catch (error) {
    console.error(`Error getting user by username ${username}:`, error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserDocument>) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const { _id, user_id, created_at, ...updateData } = updates;
    
    const result = await collection.updateOne(
      { user_id: userId },
      { 
        $set: { 
          ...updateData,
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const result = await collection.deleteOne({ user_id: userId });
    
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
