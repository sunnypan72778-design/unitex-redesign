import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const id = String(req.query.id || '').trim();
  if (!id) return res.status(400).json({ error: 'id required' });

  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', auth.user.id)
    .maybeSingle();

  let order = null;
  if (id.startsWith('UTX')) {
    const { data } = await supabase.from('orders').select('id,order_no,status,origin,destination,company_id').eq('order_no', id).maybeSingle();
    order = data;
  } else {
    const { data: ref } = await supabase.from('tracking_refs').select('order_id').eq('ref_value', id).maybeSingle();
    if (ref?.order_id) {
      const { data } = await supabase.from('orders').select('id,order_no,status,origin,destination,company_id').eq('id', ref.order_id).maybeSingle();
      order = data;
    }
  }

  if (!order) return res.status(404).json({ error: 'Tracking ID not found' });

  if (!['admin', 'ops'].includes(profile?.role) && profile?.company_id !== order.company_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data: events } = await supabase
    .from('order_events')
    .select('event_type,event_text,created_at')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true });

  return res.status(200).json({ ok: true, order, events: events || [] });
}
