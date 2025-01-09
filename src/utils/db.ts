import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure the necessary environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

// Create a Supabase client instance
// The client is used to interact with the Supabase backend for database and authentication operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
