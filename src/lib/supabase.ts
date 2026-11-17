import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
if (rawUrl && !rawUrl.includes('.supabase.co') && rawUrl !== 'https://your-project.supabase.co') {
  const cleanId = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  rawUrl = `https://${cleanId}.supabase.co`;
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

