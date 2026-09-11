// src/lib/supabaseClient.ts
//
// Import elsewhere as: import { supabase } from '@/lib/supabaseClient';
//
// Vite exposes env vars via import.meta.env (VITE_ prefix only) — set these
// in a `.env` file at your project root.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[supabaseClient] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface Profile {
  id: string;
  full_name: string;
  role: 'field_officer' | 'district_officer' | 'state_authority' | 'mp_office' | 'admin';
  state: string | null;
  district: string | null;
  constituency: string | null;
}

/** Fetch the logged-in user's role + region. Call once after login. */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, state, district, constituency')
    .eq('id', user.id)
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[getCurrentUserProfile]', error.message);
    return null;
  }
  return data as Profile;
}
