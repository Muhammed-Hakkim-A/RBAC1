import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these from: https://app.supabase.com/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGc...';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
