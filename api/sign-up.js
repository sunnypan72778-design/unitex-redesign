import { adminClient } from './_auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanEmail) return res.status(400).json({ error: 'Email is required / 请输入邮箱' });
    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters / 密码至少6位' });
    }

    const supabase = adminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: cleanPassword,
      email_confirm: true
    });

    if (error) {
      const msg = String(error.message || 'Sign up failed');
      if (/already|exists|registered/i.test(msg)) {
        return res.status(409).json({ error: 'This email is already registered. Please sign in. / 邮箱已注册，请直接登录' });
      }
      return res.status(400).json({ error: msg });
    }

    return res.status(200).json({
      ok: true,
      userId: data?.user?.id || null,
      message: 'Sign up success. You can sign in now. / 注册成功，可直接登录'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
