import { supabase } from './services/supabaseClient.ts';

const checkTable = async () => {
    if (!supabase) {
        console.log('Supabase client not initialized');
        return;
    }
    const { data, error } = await supabase.from('web_categories').select('*');
    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log('Data from web_categories:', JSON.stringify(data, null, 2));
    }
};

checkTable();
