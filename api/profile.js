import { adminClient, requireUser } from './_auth.js';

const supabase = adminClient();

export default async function handler(req, res) {
  const auth = await requireUser(req);
  if (auth.error) return res.status(401).json({ error: auth.error });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,company_id,role,full_name')
      .eq('id', auth.user.id)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, profile: data || null, email: auth.user.email });
  }

  if (req.method === 'POST') {
    const { fullName, companyName } = req.body || {};
    if (!companyName) return res.status(400).json({ error: 'companyName required' });

    let companyId = null;
    const { data: company } = await supabase.from('companies').select('id').eq('name', companyName).maybeSingle();
    if (company?.id) companyId = company.id;
    else {
      const { data: created, error: cErr } = await supabase.from('companies').insert({ name: companyName }).select('id').single();
      if (cErr) return res.status(500).json({ error: cErr.message });
      companyId = created.id;
    }

    const payload = {
      id: auth.user.id,
      company_id: companyId,
      role: 'customer',
      full_name: fullName || null
    };

    const { data, error } = await supabase.from('profiles').upsert(payload).select('id,company_id,role,full_name').single();
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true, profile: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
