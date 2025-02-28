
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PostHeader } from './blog/PostHeader';
import { PostImage } from './blog/PostImage';
import { PostActions } from './blog/PostActions';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
    image: string;
    category?: string;
    content?: string;
    tags?: string[];
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      checkIfPostIsLiked();
      fetchLikesCount();
      fetchCommentsCount();
    }
  }, [isSignedIn, post.id, user?.id]);

  const checkIfPostIsLiked = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('blog_id', post.id)
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchLikesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', post.id);
      
      if (error) throw error;
      if (count !== null) setLikesCount(count);
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const fetchCommentsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', post.id);
      
      if (error) throw error;
      if (count !== null) setCommentsCount(count);
    } catch (error) {
      console.error('Error fetching comments count:', error);
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to like this post", {
        action: {
          label: "Sign In",
          onClick: () => navigate('/sign-in')
        }
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('blog_id', post.id)
          .eq('user_id', user?.id);
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await supabase
          .from('likes')
          .insert([
            { blog_id: post.id, user_id: user?.id }
          ]);
        
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Unable to process your like. Please try again.");
    }
  };

  const handleCommentClick = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to comment on this post", {
        action: {
          label: "Sign In",
          onClick: () => navigate('/sign-in')
        }
      });
      return;
    }
    navigate(`/post/${post.id}`);
  };

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', post.id);
      
      if (error) throw error;
      
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${post.author}`);
  };

  const navigateToPost = () => navigate(`/post/${post.id}`);

  const isAuthor = user?.id === post.author;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <PostHeader
        author={post.author}
        date={post.date}
        isAuthor={isAuthor}
        onAuthorClick={navigateToProfile}
        onDelete={handleDeletePost}
      />
      
      <PostImage
        image={post.image}
        title={post.title}
        category={post.category}
        onClick={navigateToPost}
      />
      
      <CardContent className="pt-6">
        <h3 
          className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer"
          onClick={navigateToPost}
        >
          {post.title}
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <PostActions
          isLiked={isLiked}
          likesCount={likesCount}
          commentsCount={commentsCount}
          onLike={handleLike}
          onComment={handleCommentClick}
          title={post.title}
          excerpt={post.excerpt}
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={navigateToPost}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPost;
