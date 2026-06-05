import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function sb(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.OS_SUPABASE_URL;
  const key = process.env.OS_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing OS_SUPABASE_URL or OS_SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}
