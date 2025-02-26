import React, { useEffect, useState, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Moon, Sun } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Categories data
const categories = ["All", "Technology", "Mindfulness", "Productivity", "Design", "Career"];

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || "All");
  const [email, setEmail] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate network delay for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 600));
        const userPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        console.log('User posts loaded:', userPosts);
        setAllPosts(userPosts);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts. Please refresh the page and try again.');
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Use memoization for filtering logic
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply search filter if exists
    if (debouncedSearchQuery) {
      const normalizedQuery = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        return (
          post.title?.toLowerCase().includes(normalizedQuery) ||
          post.content?.toLowerCase().includes(normalizedQuery) ||
          post.author?.toLowerCase().includes(normalizedQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
      });
    }

    return filtered;
  }, [selectedCategory, debouncedSearchQuery, allPosts]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(category === "All" ? {} : { category: category.toLowerCase() });
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode activated`);
  };

  // Pagination controls
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <Card key={`skeleton-${index}`} className="p-4 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </Card>
    ));
  };

  return (
    <ErrorBoundary fallback={<div className="p-8 text-center">Something went wrong. Please refresh the page.</div>}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <section className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center gap-2">
                <h1 className="text-4xl tracking-tight sm:text-2xl font-bold text-[#01346b]">
                  Welcome to ByteBound
                  {isSignedIn && `, ${user.firstName || user.username}`}
                </h1>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ideas Worth Sharing, Stories Worth Telling.
              </p>
            </div>

            <div className="mb-6">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search posts..."
                className="w-full md:w-96 mx-auto"
                initialValue={searchQuery}
              />
            </div>

            {debouncedSearchQuery && (
              <p className="text-sm text-muted-foreground mb-4">
                {filteredPosts.length === 0 
                  ? `No results found for "${debouncedSearchQuery}"`
                  : `Showing ${filteredPosts.length} results for "${debouncedSearchQuery}"`
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
                  aria-pressed={selectedCategory === category}
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
                    aria-label="Email address"
                  />
                  <Button type="submit">Subscribe</Button>
                </div>
              </form>
            </Card>

            <div id="posts-section" className="scroll-mt-8">
              {error && (
                <div className="text-center p-8 text-red-500">
                  {error}
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  renderSkeletons()
                ) : currentPosts.length > 0 ? (
                  currentPosts.map(post => (
                    <BlogPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {debouncedSearchQuery 
                      ? 'No posts found matching your search criteria.' 
                      : selectedCategory !== "All"
                        ? `No posts found in the ${selectedCategory} category.`
                        : 'No posts found. Create your first post!'}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredPosts.length > postsPerPage && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current={currentPage === pageNumber ? "page" : undefined}
                      className="w-10 h-10 p-0"
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next
                  </Button>
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
          aria-label="Create new post"
        >
          <Plus className={`h-6 w-6 ${isCreating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
