import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSearch<T>(
  tableName: string,
  searchFields: string[],
  initialQuery: string = '',
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let supabaseQuery = supabase.from(tableName).select('*');

        // Add search conditions for each field
        if (query) {
          const conditions = searchFields.map(field => 
            `${field}.ilike.%${query}%`
          );
          
          // Combine conditions with OR
          supabaseQuery = supabaseQuery.or(conditions.join(','));
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query, tableName, searchFields]);

  return { query, setQuery, results, isLoading, error };
} 