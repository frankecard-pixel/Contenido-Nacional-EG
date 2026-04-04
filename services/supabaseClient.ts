import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if env vars are missing to prevent crashes during development
// In a real production environment, we would want this to throw.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : null as any; // Cast to any to avoid type errors in components that expect a client

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Supabase features will not work. Please add them to your environment variables.');
}

export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.warn('Cannot test connection: Supabase client is not initialized.');
    return false;
  }
  try {
    const { data, error } = await supabase.from('users').select('id', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};
