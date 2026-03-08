import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  const { customerName, mode, origin, destination, etaTarget, cargoDetails } = req.body || {};
  if (!origin || !destination) return res.status(400).json({ error: 'Missing required fields' });

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (pErr) return res.status(500).json({ error: pErr.message });
  if (!profile?.company_id && !['admin', 'ops'].includes(profile?.role)) {
    return res.status(403).json({ error: 'No company bound to this account. Ask admin to bind profile.company_id' });
  }

  const orderNo = `UTX${Date.now().toString().slice(-8)}`;
  const { data: order, error } = await supabase.from('orders').insert({
    order_no: orderNo,
    company_id: profile.company_id,
    created_by: auth.user.id,
    mode: mode || null,
    origin,
    destination,
    eta_target: etaTarget || null,
    cargo_details: cargoDetails || null,
    status: 'order_created'
  }).select('*').single();

  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('order_events').insert({
    order_id: order.id,
    event_type: 'order_created',
    event_text: `Order created by ${customerName || auth.user.email || 'customer'}`,
    created_by: auth.user.id
  });

  return res.status(200).json({ ok: true, orderNo, order });
}
