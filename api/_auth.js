import { createClient } from '@supabase/supabase-js';

export function adminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function requireUser(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { error: 'Unauthorized: missing token' };

  const authClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  const { data, error } = await authClient.auth.getUser();
  if (error || !data?.user) return { error: 'Unauthorized: invalid token' };
  return { user: data.user };
}
