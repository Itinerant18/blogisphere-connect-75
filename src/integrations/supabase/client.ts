// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tssotvbzayizuscbsuwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc290dmJ6YXlpenVzY2JzdXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDgxMDUsImV4cCI6MjA1NTYyNDEwNX0.Hm2IxuScWMhnrRHRC02VE8tovnjX4KhCIBf2PhD4ATo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);