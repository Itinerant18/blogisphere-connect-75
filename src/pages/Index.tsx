
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare, Heart } from "lucide-react";
import BlogPost from '@/components/BlogPost';
import FeaturedPosts from '@/components/FeaturedPosts';
import Navbar from '@/components/Navbar';

const dummyPosts = [
  {
    id: '1',
    title: 'The Art of Mindful Living',
    excerpt: 'Discover how mindfulness can transform your daily life and enhance your well-being...',
    author: 'Sarah Chen',
    date: '2024-03-10',
    likes: 42,
    comments: 8,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
  },
  {
    id: '2',
    title: 'Future of Technology',
    excerpt: 'Exploring the latest trends in AI, blockchain, and quantum computing...',
    author: 'Michael Johnson',
    date: '2024-03-09',
    likes: 35,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome to BlogSphere
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your stories, connect with others, and discover amazing content.
            </p>
          </div>

          <FeaturedPosts />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dummyPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
