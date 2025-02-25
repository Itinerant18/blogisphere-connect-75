import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Sun, Moon, Search } from "lucide-react";
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
const Index = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    isSignedIn,
    user
  } = useUser();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [email, setEmail] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  useEffect(() => {
    const userPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    console.log('User posts loaded:', userPosts);
    setAllPosts(userPosts);
  }, []);
  const filteredPosts = allPosts.filter(post => selectedCategory === "All" || post.category === selectedCategory).filter(post => searchQuery === "" || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
  console.log('Filtered posts:', filteredPosts);
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
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300">
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

          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-xl rounded-none bg-slate-50">
              <Input type="search" placeholder="Search posts..." value={searchQuery} onChange={e => handleSearch(e.target.value)} className="pl-20 bg-zinc-200" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-transform hover:scale-110 font-thin">
              {theme === "dark" ? <Sun className="h-5 w-5 transition-transform hover:rotate-45" /> : <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />}
            </Button>
          </div>

          <FeaturedPosts />

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} onClick={() => setSelectedCategory(category)} className="rounded-full transition-all hover:scale-105">
                {category}
              </Button>)}
          </div>

          <Card className="p-6 max-w-xl mx-auto bg-primary/5 backdrop-blur-sm">
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
            {filteredPosts.length > 0 ? filteredPosts.map(post => <BlogPost key={post.id} post={post} />) : <div className="col-span-full text-center py-8 text-muted-foreground">
                No posts found. {searchQuery ? 'Try a different search term.' : 'Create your first post!'}
              </div>}
          </div>
        </section>
      </main>
      
      <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110" onClick={handleCreatePost}>
        <Plus className="h-6 w-6" />
      </Button>
    </div>;
};
export default Index;