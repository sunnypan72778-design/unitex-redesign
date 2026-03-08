import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    const row = {};
    header.forEach((h, i) => row[h] = cols[i] ?? '');
    return row;
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  const { data: p } = await supabase.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
  if (!['ops', 'admin'].includes(p?.role)) return res.status(403).json({ error: 'Forbidden' });

  const { csv } = req.body || {};
  if (!csv) return res.status(400).json({ error: 'csv required' });

  const rows = parseCSV(csv);
  let updated = 0;

  for (const r of rows) {
    if (!r.order_no || !r.status || !r.event_text) continue;
    const { data: order } = await supabase.from('orders').select('id').eq('order_no', r.order_no).maybeSingle();
    if (!order?.id) continue;

    await supabase.from('orders').update({ status: r.status }).eq('id', order.id);
    await supabase.from('order_events').insert({
      order_id: order.id,
      event_type: r.event_type || 'status_update',
      event_text: r.event_text,
      created_by: auth.user.id
    });
    updated += 1;
  }

  return res.status(200).json({ ok: true, updated });
}
