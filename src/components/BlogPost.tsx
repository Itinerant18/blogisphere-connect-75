
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in glass-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight hover:text-primary-foreground/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            By {post.author} • {new Date(post.date).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="space-x-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments}</span>
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
