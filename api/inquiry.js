import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { companyName, contactName, email, origin, destination, cargoDetails } = req.body || {};
  if (!companyName || !origin || !destination) return res.status(400).json({ error: 'Missing required fields' });

  const inquiryNo = `INQ${Date.now().toString().slice(-8)}`;

  let companyId = null;
  const { data: company } = await supabase.from('companies').select('id').eq('name', companyName).maybeSingle();
  if (company?.id) companyId = company.id;
  else {
    const { data: c, error: cErr } = await supabase.from('companies').insert({ name: companyName }).select('id').single();
    if (cErr) return res.status(500).json({ error: cErr.message });
    companyId = c.id;
  }

  const { error } = await supabase.from('inquiries').insert({
    inquiry_no: inquiryNo,
    company_id: companyId,
    contact_name: contactName || null,
    email: email || null,
    origin,
    destination,
    cargo_details: cargoDetails || null
  });
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    ok: true,
    inquiryNo,
    autoReply: `Inquiry ${inquiryNo} received. We will respond within 2-6 business hours.`
  });
}
