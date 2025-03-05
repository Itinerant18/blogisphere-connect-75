import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/types/post';

/**
 * Utility function to create a backup of Supabase blogs in localStorage
 */
export const backupSupabaseData = async () => {
  try {
    // Fetch all posts from Supabase
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No data to backup');
      return { success: true, backed_up: 0 };
    }
    
    console.log(`Found ${data.length} posts to backup`);
    
    // Save to localStorage
    localStorage.setItem('supabase_blogs_backup', JSON.stringify(data));
    
    return {
      success: true,
      backed_up: data.length
    };
  } catch (error) {
    console.error('Backup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Utility function to restore data from a backup
 */
export const restoreFromBackup = async () => {
  try {
    const backupData = localStorage.getItem('supabase_blogs_backup');
    
    if (!backupData) {
      console.log('No backup data found');
      return { success: false, error: 'No backup data found' };
    }
    
    const posts = JSON.parse(backupData);
    
    if (!posts || posts.length === 0) {
      console.log('Backup is empty');
      return { success: false, error: 'Backup is empty' };
    }
    
    console.log(`Found ${posts.length} posts to restore`);
    
    // Restore each post to Supabase
    const results = await Promise.all(
      posts.map(async (post) => {
        try {
          // Create a new post in Supabase
          const { data, error } = await supabase
            .from('blogs')
            .insert({
              title: post.title,
              content: post.content,
              image_url: post.image_url,
              user_id: post.user_id
            });
          
          if (error) throw error;
          
          return { success: true, originalId: post.id };
        } catch (postError) {
          console.error(`Error restoring post ${post.id}:`, postError);
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
      restored: successful,
      failed,
      details: results
    };
  } catch (error) {
    console.error('Restoration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// For backward compatibility, keeping these function names but implementing them to use the backup/restore functions
export const migrateFromSupabaseToFirebase = backupSupabaseData;
export const migrateFromSupabaseToMongoDB = backupSupabaseData;
