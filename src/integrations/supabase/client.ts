
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tssotvbzayizuscbsuwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc290dmJ6YXlpenVzY2JzdXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDgxMDUsImV4cCI6MjA1NTYyNDEwNX0.Hm2IxuScWMhnrRHRC02VE8tovnjX4KhCIBf2PhD4ATo";

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, init).catch(error => {
        console.error('Network error during Supabase request:', error);
        throw error;
      });
    },
  },
});
