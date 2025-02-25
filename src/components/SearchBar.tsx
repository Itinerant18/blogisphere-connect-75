import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react'; // Assuming you're using Lucide icons

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialQuery?: string;
  debounceTime?: number;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = '',
  initialQuery = '',
  debounceTime = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, debounceTime),
    [onSearch, debounceTime]
  );
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  // Clear search
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 
