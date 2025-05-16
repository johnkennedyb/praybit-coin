
import { createClient } from '@supabase/supabase-js';

// Use the values from the integrated Supabase project
const supabaseUrl = "https://lifwrxexniqgfbctareb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZndyeGV4bmlxZ2ZiY3RhcmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ5MjAsImV4cCI6MjA2MjkzMDkyMH0.XWVR9cxD1WBXRlqdF7-DrX9gR4Qc_j5IFKpNtCeLVVA";

// Create and export the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
