
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Post } from '@/types/post';

const FeaturedPosts = () => {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the error for no rows returned
          console.error('Error fetching featured post:', error);
          throw error;
        }

        console.log('Featured post data:', data);
        if (data) {
          setFeaturedPost({
            id: data.id,
            title: data.title,
            content: data.content,
            excerpt: data.content?.substring(0, 150) + '...',
            author: data.user_id || 'Anonymous',
            date: data.created_at,
            likes: 0,
            comments: 0,
            image: data.image_url || '/placeholder.svg',
            category: data.category || 'Uncategorized',
            tags: data.tags || []
          });
        }
      } catch (error) {
        console.error('Failed to fetch featured post:', error);
        toast.error('Could not load featured post');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPost();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container">
          <Card className="overflow-hidden animate-pulse">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-[400px] md:h-auto bg-muted"></div>
              <CardContent className="flex flex-col justify-center p-8 space-y-6">
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div className="h-10 bg-muted rounded w-28"></div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (!featuredPost) return null;

  return (
    <section className="py-12">
      <div className="container">
        <Card className="overflow-hidden transform transition-all hover:scale-[1.01]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[400px] md:h-auto">
              <img 
                alt={featuredPost.title} 
                src={featuredPost.image}
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
            <CardContent className="flex flex-col justify-center p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {featuredPost.title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  By{' '}
                  <span 
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${featuredPost.author}`)}
                  >
                    {featuredPost.author}
                  </span>
                </p>
              </div>
              <p className="text-lg">
                {featuredPost.excerpt}
              </p>
              <div>
                <Button onClick={() => navigate(`/post/${featuredPost.id}`)}>
                  Read More
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedPosts;
