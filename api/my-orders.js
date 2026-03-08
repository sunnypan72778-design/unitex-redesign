import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!profile?.company_id && profile?.role !== 'admin' && profile?.role !== 'ops') {
    return res.status(403).json({ error: 'No company bound to this account' });
  }

  let query = supabase
    .from('orders')
    .select('id,order_no,status,mode,origin,destination,eta_target,created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (!['admin', 'ops'].includes(profile.role)) {
    query = query.eq('company_id', profile.company_id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, items: data || [] });
}
