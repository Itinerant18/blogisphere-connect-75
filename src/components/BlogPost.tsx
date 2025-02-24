
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  const { user } = useUser();

  const handleDeletePost = () => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = posts.filter((p: any) => p.id !== post.id);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    toast.success('Post deleted successfully');
    // Force a page reload to reflect the changes
    window.location.reload();
  };

  const navigateToProfile = () => {
    navigate(`/profile/${post.author}`);
  };

  const isAuthor = user?.username === post.author || user?.firstName === post.author;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={navigateToProfile}
          >
            <Avatar>
              <div className="w-10 h-10 rounded-full bg-muted" />
            </Avatar>
            <div>
              <p className="font-medium leading-none hover:text-primary transition-colors">
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
              <DropdownMenuContent align="end">
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
          onClick={navigateToProfile}
        >
          {post.title}
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="space-x-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm">
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
