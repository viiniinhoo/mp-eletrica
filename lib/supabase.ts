import { createClient } from '@supabase/supabase-js';

// No Vite, as variáveis de ambiente devem começar com VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase environment variables missing or using placeholders. Check your .env.local file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    }
);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
