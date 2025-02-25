import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/types';

export function usePosts() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');
      
      if (error) throw error;
      return data as Post[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPost: Omit<Post, 'id'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    posts: postsQuery.data || [],
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending,
  };
} 