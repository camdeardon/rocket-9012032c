
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xpvvgdwinvgrnlvzztpn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdnZnZHdpbnZncm5sdnp6dHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMzQwNjcsImV4cCI6MjA1NDcxMDA2N30.K_MrYzRlrxMim9lfq7J3LxNYg4UApIkm96hSvjfePdo";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'rocket-match-app',
    },
  },
});
