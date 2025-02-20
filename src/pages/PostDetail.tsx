
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";
import Navbar from '@/components/Navbar';

const PostDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <header className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">March 10, 2024</p>
                  </div>
                </div>
                <h1 className="text-4xl font-bold">The Art of Mindful Living</h1>
              </header>

              <div className="prose prose-lg max-w-none">
                <p>This is where the full blog post content would go...</p>
              </div>

              <footer className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>42</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>8</span>
                  </Button>
                  <Button variant="ghost" size="sm">
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
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full min-h-[100px] p-4 rounded-lg border resize-none"
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
