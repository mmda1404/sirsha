import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
    console.warn('⚠️ Supabase credentials missing. Supabase integration will be disabled.');
}

export const supabase = createClient(
    config.supabaseUrl || '',
    config.supabaseServiceKey || '',
    {
        auth: {
            persistSession: false,
        },
    }
);
