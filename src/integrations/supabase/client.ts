
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tssotvbzayizuscbsuwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc290dmJ6YXlpenVzY2JzdXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDgxMDUsImV4cCI6MjA1NTYyNDEwNX0.Hm2IxuScWMhnrRHRC02VE8tovnjX4KhCIBf2PhD4ATo";



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Add error handling for failed requests
    fetch: (...args) => {
      return fetch(...args).catch(error => {
        console.error('Network error during Supabase request:', error);
        throw error;
      });
    },
  },
});
