
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

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
  };
}

const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="pt-6">
        <h3 className="text-2xl font-semibold tracking-tight hover:text-primary transition-colors">
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
        <Button variant="outline" size="sm">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPost;
