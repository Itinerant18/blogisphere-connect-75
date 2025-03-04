
import { supabase } from '@/integrations/supabase/client';
import { createPost as createFirebasePost } from '@/integrations/firebase/blogService';
import { createPost as createMongoPost } from '@/integrations/mongodb/blogService';
import type { Post } from '@/types/post';
import { formatPost } from '@/integrations/mongodb/utils/formatters';

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
            author: post.author || 'Unknown User',
            featured: post.featured || false,
            tags: tags || [],
            excerpt: post.excerpt || post.title,
            category: category
          };
          
          const result = await createFirebasePost(newPost);
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
    return {
      success: false,
      error: error.message
    };
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
    
    // Migrate each post to MongoDB
    const results = await Promise.all(
      data.map(async (post) => {
        try {
          // Process content if it's stored as JSON
          let postContent = post.content;
          let category = undefined;
          let tags = [];
          
          try {
            if (typeof post.content === 'string') {
              const contentObj = JSON.parse(post.content);
              if (contentObj && typeof contentObj === 'object') {
                postContent = contentObj.content || post.content;
                category = contentObj.category;
                tags = contentObj.tags || [];
              }
            }
          } catch (e) {
            // If parsing fails, use the original content
            console.log(`Error parsing content for post ${post.id}: ${e.message}`);
          }
          
          // Format author to object format expected by MongoDB
          let author = { name: 'Unknown User' };
          if (post.author) {
            if (typeof post.author === 'object') {
              author = post.author;
            } else if (typeof post.author === 'string') {
              author = { name: post.author };
            }
          }
          
          // Create a new post in MongoDB format
          const newPost = {
            title: post.title || 'Untitled Post',
            content: typeof postContent === 'string' ? postContent : JSON.stringify(postContent),
            user_id: post.user_id || 'anonymous',
            author: author,
            featured: post.featured || false,
            tags: Array.isArray(tags) ? tags : [],
            featured_image: post.image_url || post.image || '/placeholder.svg',
            excerpt: post.excerpt || (typeof post.title === 'string' ? post.title : 'Untitled Post'),
            published: true,
            likes_count: 0,
            comments_count: 0,
            views_count: 0,
            slug: typeof post.title === 'string' ? post.title.toLowerCase().replace(/\s+/g, '-') : 'untitled-post',
            reading_time: typeof postContent === 'string' ? Math.ceil(postContent.length / 1000) : 1,
            category: category || 'Uncategorized',
            created_at: new Date(),
            updated_at: new Date()
          };
          
          const result = await createMongoPost(newPost);
          
          return {
            success: true,
            originalId: post.id,
            newId: result.id
          };
        } catch (postError) {
          console.error(`Error migrating post ${post.id}:`, postError);
          return {
            success: false,
            originalId: post.id,
            error: postError.message
          };
        }
      })
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      success: true,
      migrated: successful,
      failed,
      details: results
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
