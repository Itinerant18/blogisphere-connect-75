
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BlogPost from '@/components/BlogPost';
import FeaturedPosts from '@/components/FeaturedPosts';
import Navbar from '@/components/Navbar';
import { useTheme } from 'next-themes';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Post } from '../types/post';
import { SearchBar } from '@/components/SearchBar';

const categories = ["All", "Technology", "Mindfulness", "Productivity", "Design", "Career"];

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || "All");
  const [email, setEmail] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const userPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    console.log('User posts loaded:', userPosts);
    setAllPosts(userPosts);
  }, []);

  useEffect(() => {
    let filtered = [...allPosts];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply search filter if exists
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        return (
          post.title?.toLowerCase().includes(normalizedQuery) ||
          post.content?.toLowerCase().includes(normalizedQuery) ||
          post.author?.toLowerCase().includes(normalizedQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
      });
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchQuery, allPosts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(category === "All" ? {} : { category: category.toLowerCase() });
  };

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

    setIsCreating(true);
    try {
      navigate('/create');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error("Unable to access create post page. Please try again.");
      setIsCreating(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
  <h1 className="text-4xl tracking-tight sm:text-2xl font-bold text-[#01346b]">
    Welcome to ByteBound, 
    {isSignedIn && (
      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        {user.firstName || user.username}
      </span>
    )}
  </h1>
  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
    Ideas Worth Sharing, Stories Worth Telling.
  </p>
</div>

          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search posts..."
              className="w-full md:w-96 mx-auto"
            />
          </div>

          {searchQuery && (
            <p className="text-sm text-muted-foreground mb-4">
              {filteredPosts.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Showing ${filteredPosts.length} results for "${searchQuery}"`
              }
            </p>
          )}

          <FeaturedPosts />

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className="rounded-full transition-all hover:scale-105 animate-fade-in"
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedCategory !== "All" && (
            <p className="text-center text-muted-foreground">
              Showing posts in {selectedCategory} category
            </p>
          )}

          <Card className="p-6 max-w-xl mx-auto bg-primary/5 backdrop-blur-sm">
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold text-center">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground text-center">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </Card>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <BlogPost key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {searchQuery 
                  ? 'No posts found matching your search criteria.' 
                  : selectedCategory !== "All"
                    ? `No posts found in the ${selectedCategory} category.`
                    : 'No posts found. Create your first post!'}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Button 
        size="icon" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
        onClick={handleCreatePost}
        disabled={isCreating}
      >
        <Plus className={`h-6 w-6 ${isCreating ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default Index;
