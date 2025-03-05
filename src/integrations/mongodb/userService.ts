
/**
 * User Service
 * 
 * This file provides methods for performing CRUD operations on user documents in MongoDB.
 */

import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import { UserDocument, COLLECTIONS } from './schema';
import { v4 as uuidv4 } from 'uuid';

// Wherever there are type errors with formatUser, update to use DocumentLike type
import { formatUser, DocumentLike } from './utils/formatters';

/**
 * Create a new user
 */
export const createUser = async (user: Omit<UserDocument, 'id' | '_id' | 'created_at' | 'updated_at'>) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const newUser: UserDocument = {
      id: uuidv4(),
      ...user,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await collection.insertOne(newUser);
    
    return { 
      id: result.insertedId.toString(),
      success: true 
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (userId: string, updates: Partial<UserDocument>) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    // Try to find by id field first
    let user = await collection.findOne({ id: userId });
    let query: Record<string, any> = { id: userId };
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!user) {
      try {
        const objectId = new ObjectId(userId);
        user = await collection.findOne({ _id: objectId });
        if (user) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Ensure we don't overwrite id or _id
    const { id, _id, ...updateData } = updates as any;
    
    const result = await collection.updateOne(
      query,
      { 
        $set: { 
          ...updateData,
          updated_at: new Date() 
        } 
      }
    );
    
    if (result.modifiedCount === 0) {
      throw new Error('User not found or no changes made');
    }
    
    const updatedUser = await collection.findOne(query);
    return formatUser(updatedUser as DocumentLike);
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    // Try to find by id field first
    let user = await collection.findOne({ id: userId });
    let query: Record<string, any> = { id: userId };
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!user) {
      try {
        const objectId = new ObjectId(userId);
        user = await collection.findOne({ _id: objectId });
        if (user) {
          query = { _id: objectId };
        }
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    // Try to find by id field first
    let user = await collection.findOne({ id: userId });
    
    // If not found, try to find by _id if it's a valid ObjectId
    if (!user) {
      try {
        const objectId = new ObjectId(userId);
        user = await collection.findOne({ _id: objectId });
      } catch (e) {
        // Not a valid ObjectId, which is fine
      }
    }
    
    if (!user) return null;
    
    return formatUser(user as DocumentLike);
  } catch (error) {
    console.error(`Error getting user by ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Get a user by email
 */
export const getUserByEmail = async (email: string) => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const user = await collection.findOne({ email });
    
    if (!user) return null;
    
    return formatUser(user as DocumentLike);
  } catch (error) {
    console.error(`Error getting user by email ${email}:`, error);
    throw error;
  }
};

/**
 * List all users
 */
export const getAllUsers = async () => {
  try {
    const collection = await getCollection(COLLECTIONS.USERS);
    
    const users = await collection.find().toArray();
    
    return users.map(user => formatUser(user as DocumentLike));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};
