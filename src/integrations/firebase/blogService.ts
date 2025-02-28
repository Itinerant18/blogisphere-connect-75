import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './client';
import type { Post } from '../../types/post';

const COLLECTION_NAME = 'blogs';

// Create a new blog post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      created_at: serverTimestamp(),
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Get all blog posts
export const getAllPosts = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
export const getPostById = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      } as Post;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUserId = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Update a blog post
export const updatePost = async (id: string, updates: Partial<Post>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a blog post
export const deletePost = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Upload an image to Firebase Storage
export const uploadImage = async (file: File, path: string = 'blog-images') => {
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Subscribe to real-time updates for posts
export const subscribeToPostUpdates = (callback: (posts: Post[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('created_at', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      } as Post);
    });
    
    callback(posts);
  });
};

// Get featured posts
export const getFeaturedPosts = async (count: number = 3) => {
  try {
    // This is a simple implementation - in a real app, you might have a 'featured' field
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('created_at', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : new Date().toISOString(),
      } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting featured posts:', error);
    throw error;
  }
};
