import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { origin, destination } = req.query;
  if (!origin || !destination) return res.status(400).json({ error: 'origin and destination are required' });

  const { data, error } = await supabase
    .from('schedules')
    .select('origin,destination,vessel,etd,eta')
    .ilike('origin', `%${origin}%`)
    .ilike('destination', `%${destination}%`)
    .eq('active', true)
    .order('etd', { ascending: true })
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, items: data || [] });
}
