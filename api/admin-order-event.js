import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!['ops', 'admin'].includes(profile?.role)) {
    return res.status(403).json({ error: 'Forbidden: ops/admin only' });
  }

  const { orderNo, status, eventType, eventText } = req.body || {};
  if (!orderNo || !status || !eventText) return res.status(400).json({ error: 'orderNo, status, eventText required' });

  const { data: order, error: oErr } = await supabase
    .from('orders')
    .select('id,order_no,status')
    .eq('order_no', orderNo)
    .maybeSingle();

  if (oErr) return res.status(500).json({ error: oErr.message });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { error: uErr } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', order.id);
  if (uErr) return res.status(500).json({ error: uErr.message });

  const { error: eErr } = await supabase
    .from('order_events')
    .insert({
      order_id: order.id,
      event_type: eventType || 'status_update',
      event_text: eventText,
      created_by: auth.user.id
    });

  if (eErr) return res.status(500).json({ error: eErr.message });

  return res.status(200).json({ ok: true, message: `Order ${orderNo} updated` });
}
