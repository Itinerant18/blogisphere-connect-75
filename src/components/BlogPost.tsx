import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
const BlogPost = ({
  post
}: BlogPostProps) => {
  const navigate = useNavigate();
  const {
    user
  } = useUser();
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
  return <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      
      
      
      
      
      
      
    </Card>;
};
export default BlogPost;