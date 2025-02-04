import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scvqkkdljratvuhbvwur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjdnFra2RsanJhdHZ1aGJ2d3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODg0NzAsImV4cCI6MjAyMzA2NDQ3MH0.SYLqF7hdlzM8_Kk8Zzr6S3t8OYMjNEHJRYJF8yGiXaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // This ensures session is not persisted
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  // Disable local cache
  db: {
    schema: 'public'
  },
});