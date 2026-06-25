
import { supabase } from './services/supabaseClient';

async function check() {
  if (!supabase) {
    console.log('Supabase not initialized');
    return;
  }
  const { data, error } = await supabase.from('web_categories').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Categories:', data.length);
  }
}
check();
