
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getFeaturedPosts } from "@/integrations/supabase/blogService";
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
        const posts = await getFeaturedPosts(1);
        
        console.log('Featured post data:', posts[0] || null);
        if (posts && posts.length > 0) {
          const data = posts[0];
          
          // Process content if it's stored as JSON
          let postContent = data.content;
          let category = undefined;
          let tags = undefined;
          
          try {
            // Try to parse the content as JSON
            const parsedContent = JSON.parse(data.content);
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
            console.log('Content is not in JSON format');
          }
          
          // Create a processed post object with the extracted data
          const processedPost: Post = {
            ...data,
            content: postContent,
            category,
            tags,
          };
          
          setFeaturedPost(processedPost);
        } else {
          setFeaturedPost(null);
        }
      } catch (error) {
        console.error('Error fetching featured post:', error);
        toast.error('Failed to load featured post');
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
                src={featuredPost.image_url || '/placeholder.svg'}
                className="absolute inset-0 w-full h-full object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
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
                    onClick={() => navigate(`/profile/${featuredPost.user_id || 'Anonymous'}`)}
                  >
                    {featuredPost.user_id || 'Anonymous'}
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
