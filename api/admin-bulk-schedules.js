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

  const rows = parseCSV(csv).map(r => ({
    origin: r.origin,
    destination: r.destination,
    vessel: r.vessel,
    etd: r.etd,
    eta: r.eta,
    active: String(r.active || 'true').toLowerCase() !== 'false'
  })).filter(r => r.origin && r.destination && r.vessel && r.etd && r.eta);

  if (!rows.length) return res.status(400).json({ error: 'No valid rows' });

  const { error } = await supabase.from('schedules').insert(rows);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, inserted: rows.length });
}
