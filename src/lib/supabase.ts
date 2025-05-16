
import { createClient } from '@supabase/supabase-js';

// Define fallback values for local development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if URL is missing and provide a helpful error message
if (!supabaseUrl) {
  console.error(
    'Supabase URL is missing! Make sure you have connected your Lovable project to Supabase using the Supabase button in the top right corner.'
  );
}

// Create and export the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

