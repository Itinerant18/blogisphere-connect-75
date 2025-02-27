
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FeaturedPosts from '@/components/FeaturedPosts';
import Navbar from '@/components/Navbar';
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Post } from '../types/post';
import { SearchBar } from '@/components/SearchBar';
import { supabase } from "@/integrations/supabase/client";
import { WelcomeHeader } from '@/components/home/WelcomeHeader';
import { CategoriesFilter } from '@/components/home/CategoriesFilter';
import { NewsletterSubscription } from '@/components/home/NewsletterSubscription';
import { PostsGrid } from '@/components/home/PostsGrid';

const categories = ["All", "Technology", "Mindfulness", "Productivity", "Design", "Career"];

const Index = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('Initial posts loaded:', data);
        setAllPosts(data as Post[]);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('public:blogs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAllPosts(current => [payload.new as Post, ...current]);
            toast.info('New post added!');
          } else if (payload.eventType === 'DELETE') {
            setAllPosts(current => current.filter(post => post.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setAllPosts(current =>
              current.map(post =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = [...allPosts];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

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
          <WelcomeHeader />

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

          <CategoriesFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <NewsletterSubscription />

          <PostsGrid 
            posts={filteredPosts}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
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
