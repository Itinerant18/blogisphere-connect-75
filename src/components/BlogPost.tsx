
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  useEffect(() => {
    if (isSignedIn) {
      checkIfPostIsLiked();
    }
  }, [isSignedIn, post.id]);

  const checkIfPostIsLiked = async () => {
    try {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('blog_id', post.id)
        .eq('user_id', user?.id)
        .single();
      
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
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
        // Unlike the post
        await supabase
          .from('likes')
          .delete()
          .eq('blog_id', post.id)
          .eq('user_id', user?.id);
        
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like the post
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

  const handleDeletePost = () => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = posts.filter((p: any) => p.id !== post.id);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    toast.success('Post deleted successfully');
    window.location.reload();
  };

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${post.author}`);
  };

  const isAuthor = user?.username === post.author || user?.firstName === post.author;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={navigateToProfile}
          >
            <Avatar className="transition-transform group-hover:scale-105">
              <AvatarFallback className="bg-primary/10">
                {post.author[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none group-hover:text-primary transition-colors">
                {post.author}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={handleDeletePost}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <div 
        className="aspect-video relative overflow-hidden cursor-pointer"
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {post.category && (
          <Badge className="absolute top-2 right-2">
            {post.category}
          </Badge>
        )}
      </div>
      
      <CardContent className="pt-6">
        <h3 
          className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.title}
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant={isLiked ? "default" : "ghost"} 
            size="sm" 
            className="space-x-2"
            onClick={handleLike}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="space-x-2"
            onClick={handleCommentClick}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              navigator.share?.({
                title: post.title,
                text: post.excerpt,
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              });
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPost;
