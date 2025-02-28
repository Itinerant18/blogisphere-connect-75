import { supabase } from '@/integrations/supabase/client';
import { createPost } from '@/integrations/firebase/blogService';
// Uncomment the following line if you want to use MongoDB instead
// import { createPost as createMongoPost } from '@/integrations/mongodb/blogService';
import type { Post } from '@/types/post';

/**
 * Utility function to migrate data from Supabase to Firebase
 */
export const migrateFromSupabaseToFirebase = async () => {
  try {
    // Fetch all posts from Supabase
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No data to migrate');
      return { success: true, migrated: 0 };
    }
    
    console.log(`Found ${data.length} posts to migrate`);
    
    // Migrate each post to Firebase
    const results = await Promise.all(
      data.map(async (post) => {
        try {
          // Process content if it's stored as JSON
          let postContent = post.content;
          let category = undefined;
          let tags = undefined;
          
          try {
            // Try to parse the content as JSON
            const parsedContent = JSON.parse(post.content);
            if (parsedContent && typeof parsedContent === 'object') {
              if (parsedContent.text) {
                postContent = parsedContent.text;
              }
              if (parsedContent.metadata) {
                category = parsedContent.metadata.category;
                tags = parsedContent.metadata.tags;
              }
            }
          } catch (e) {
            // If parsing fails, use the content as is
          }
          
          // Create a new post in Firebase
          const newPost: Omit<Post, 'id' | 'created_at'> = {
            title: post.title,
            content: post.content, // Keep the original JSON format
            image_url: post.image_url || '/placeholder.svg',
            user_id: post.user_id,
            author: 'Anonymous', // You might want to fetch the actual author name
            date: post.created_at || new Date().toISOString(),
            likes: 0,
            comments: 0,
            image: post.image_url || '/placeholder.svg',
            category: category || 'Uncategorized',
            tags: tags || []
          };
          
          const result = await createPost(newPost);
          return { success: true, id: result.id, originalId: post.id };
        } catch (error) {
          console.error(`Failed to migrate post ${post.id}:`, error);
          return { success: false, id: post.id, error };
        }
      })
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      success: failed === 0,
      migrated: successful,
      failed,
      details: results
    };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Utility function to migrate data from Supabase to MongoDB
 */
export const migrateFromSupabaseToMongoDB = async () => {
  try {
    // Fetch all posts from Supabase
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No data to migrate');
      return { success: true, migrated: 0 };
    }
    
    console.log(`Found ${data.length} posts to migrate`);
    
    // Uncomment and modify this section to use MongoDB
    /*
    // Migrate each post to MongoDB
    const results = await Promise.all(
      data.map(async (post) => {
        try {
          // Process content if it's stored as JSON
          let postContent = post.content;
          let category = undefined;
          let tags = undefined;
          
          try {
            // Try to parse the content as JSON
            const parsedContent = JSON.parse(post.content);
            if (parsedContent && typeof parsedContent === 'object') {
              if (parsedContent.text) {
                postContent = parsedContent.text;
              }
              if (parsedContent.metadata) {
                category = parsedContent.metadata.category;
                tags = parsedContent.metadata.tags;
              }
            }
          } catch (e) {
            // If parsing fails, use the content as is
          }
          
          // Create a new post in MongoDB
          const newPost: Omit<Post, 'id' | 'created_at'> = {
            title: post.title,
            content: post.content, // Keep the original JSON format
            image_url: post.image_url || '/placeholder.svg',
            user_id: post.user_id,
            author: 'Anonymous', // You might want to fetch the actual author name
            date: post.created_at || new Date().toISOString(),
            likes: 0,
            comments: 0,
            image: post.image_url || '/placeholder.svg',
            category: category || 'Uncategorized',
            tags: tags || []
          };
          
          const result = await createMongoPost(newPost);
          return { success: true, id: result.id, originalId: post.id };
        } catch (error) {
          console.error(`Failed to migrate post ${post.id}:`, error);
          return { success: false, id: post.id, error };
        }
      })
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      success: failed === 0,
      migrated: successful,
      failed,
      details: results
    };
    */
    
    return { success: false, message: 'MongoDB migration not implemented yet' };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
