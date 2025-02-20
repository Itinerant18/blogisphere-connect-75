
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import BlogPost from '@/components/BlogPost';
import Navbar from '@/components/Navbar';

const UserProfile = () => {
  const { userId } = useParams();

  const userPosts = [
    {
      id: '1',
      title: 'The Art of Mindful Living',
      excerpt: 'Discover how mindfulness can transform your daily life...',
      author: 'Sarah Chen',
      date: '2024-03-10',
      likes: 42,
      comments: 8,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-muted relative">
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Sarah Chen</h1>
              <p className="text-muted-foreground">@sarahchen</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <p className="text-muted-foreground">Joined March 2024</p>
              <div className="flex gap-4">
                <span className="font-medium">1.2k Followers</span>
                <span className="font-medium">800 Following</span>
              </div>
            </div>
            <Button>Follow</Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {userPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
