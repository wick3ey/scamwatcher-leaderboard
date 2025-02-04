import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://scvqkkdljratvuhbvwur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjdnFra2RsanJhdHZ1aGJ2d3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MTIxNDAsImV4cCI6MjA1NDE4ODE0MH0.obDTUFPI8V7TlY5C2h0dIH6VcQfD2qkuovUkGYXtPik";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'rb-auth',
      domain: 'rugbuster.xyz'
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);