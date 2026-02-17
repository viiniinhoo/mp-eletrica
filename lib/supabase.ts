import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase environment variables missing or using placeholders.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
