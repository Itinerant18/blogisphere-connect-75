import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Sun, Moon } from "lucide-react";
import BlogPost from '@/components/BlogPost';
import FeaturedPosts from '@/components/FeaturedPosts';
import Navbar from '@/components/Navbar';
import { useTheme } from 'next-themes';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types/post';

const categories = ["All", "Technology", "Mindfulness", "Productivity", "Design", "Career"];
const dummyPosts: Post[] = [
  {
    id: 'dummy-1',
    title: 'The Art of Mindful Living',
    excerpt: 'Discover how mindfulness can transform your daily life and enhance your well-being. Learn practical tips and techniques for incorporating mindfulness into your daily routine.',
    author: 'Sarah Chen',
    date: '2024-03-10',
    likes: 42,
    comments: 8,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    category: 'Mindfulness',
    content: 'Full content here...'
  },
  {
    id: 'dummy-2',
    title: 'Future of Technology',
    excerpt: 'Exploring the latest trends in AI, blockchain, and quantum computing. Understanding how these technologies will shape our future and transform industries.',
    author: 'Michael Johnson',
    date: '2024-03-09',
    likes: 35,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    category: 'Technology',
    content: 'Full content here...'
  }
];

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [email, setEmail] = React.useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const userPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setAllPosts([...userPosts, ...dummyPosts]);
  }, []);

  const filteredPosts = selectedCategory === "All" 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  const handleCreatePost = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to create a post");
      return;
    }
    navigate('/create');
  };

  return <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to BlogSphere
              {isSignedIn && `, ${user.firstName || user.username}`}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your stories, connect with others, and discover amazing content.
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <FeaturedPosts />

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} onClick={() => setSelectedCategory(category)} className="rounded-full">
                {category}
              </Button>)}
          </div>

          <Card className="p-6 max-w-xl mx-auto bg-primary/5">
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold text-center">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground text-center">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </Card>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
      
      <Button 
        size="icon" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={handleCreatePost}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>;
};

export default Index;
