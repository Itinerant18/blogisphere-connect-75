
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
import { getAllPosts, getFeaturedPosts } from "@/integrations/mongodb/blogService";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const posts = await getAllPosts();
        console.log('Initial posts loaded:', posts);
        setAllPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = [...allPosts];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => {
        // Parse content to extract category if it's stored in JSON format
        try {
          const contentObj = JSON.parse(post.content);
          return contentObj.metadata?.category === selectedCategory;
        } catch {
          return post.category === selectedCategory;
        }
      });
    }

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        // Parse content to search within it if it's stored in JSON format
        let contentText = post.content;
        try {
          const contentObj = JSON.parse(post.content);
          contentText = contentObj.text || post.content;
        } catch {
          // Use the content as is if it's not JSON
        }
        
        return (
          post.title?.toLowerCase().includes(normalizedQuery) ||
          contentText?.toLowerCase().includes(normalizedQuery) ||
          post.author?.toLowerCase().includes(normalizedQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
      });
    }

    setFilteredPosts(filtered);
  }, [allPosts, selectedCategory, searchQuery]);

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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : (
            <PostsGrid 
              posts={filteredPosts}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          )}
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
