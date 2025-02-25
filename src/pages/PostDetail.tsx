
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Edit, 
  Trash2,
  ArrowLeft
} from "lucide-react";
import Navbar from '@/components/Navbar';
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import type { Post } from '../types/post';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const foundPost = posts.find((p: Post) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Post not found</div>
        </main>
      </div>
    );
  }

  const isAuthor = user?.username === post.author || user?.firstName === post.author;

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = () => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = posts.filter((p: Post) => p.id !== post.id);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    toast.success("Post deleted successfully");
    navigate('/');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would update the likes count in the database
    toast.success(isLiked ? "Post unliked" : "Post liked");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <article className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
            
            <CardContent className="p-6 space-y-6">
              <header className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isAuthor && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl font-bold">{post.title}</h1>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.content}
              </div>

              <footer className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleLike}
                  >
                    <ThumbsUp 
                      className={`h-4 w-4 ${isLiked ? 'fill-current text-primary' : ''}`} 
                    />
                    <span>{post.likes + (isLiked ? 1 : 0)}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold">Comments</h2>
            <div className="space-y-4">
              {/* Comment Input */}
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {user?.username?.[0] || user?.firstName?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full min-h-[100px] p-4 rounded-lg border resize-none bg-background"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostDetail;
