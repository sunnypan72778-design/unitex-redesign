let supabaseClient = null;
let authToken = null;
let currentUser = null;
let currentProfile = null;

function currentPath() {
  const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === p) a.classList.add('active');
  });
}

function bindContactForm() {
  const form = document.querySelector('#quoteForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Logistics Inquiry - Website Form');
    const body = encodeURIComponent(
`Name: ${data.get('name') || ''}\nCompany: ${data.get('company') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\nOrigin: ${data.get('origin') || ''}\nDestination: ${data.get('destination') || ''}\nDetails: ${data.get('details') || ''}`
    );
    window.location.href = `mailto:info@unitexlogistics.com?subject=${subject}&body=${body}`;
  });
}

function initBranchLocator() {
  const root = document.querySelector('#branchLocator');
  if (!root) return;

  const cityFilter = document.querySelector('#cityFilter');
  const officeSearch = document.querySelector('#officeSearch');
  const clearLocatorFilters = document.querySelector('#clearLocatorFilters');
  const branchResults = document.querySelector('#branchResults');
  const branchCount = document.querySelector('#branchCount');
  const branchEmpty = document.querySelector('#branchEmpty');
  const serviceTagFilters = document.querySelector('#serviceTagFilters');

  const branchOffices = [
    {
      officeName: 'Unitex Logistics Shanghai Branch',
      officeNameZh: 'Unitex 物流上海分公司',
      city: 'Shanghai',
      cityZh: '上海',
      email: 'shanghai@unitexlogistics.com',
      phone: '+86 21 0000 0000',
      address: 'Shanghai Port Area (placeholder)',
      tags: ['Ocean Freight', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Shenzhen Branch',
      officeNameZh: 'Unitex 物流深圳分公司',
      city: 'Shenzhen',
      cityZh: '深圳',
      email: 'shenzhen@unitexlogistics.com',
      phone: '+86 755 0000 0000',
      address: 'Shenzhen Port Area (placeholder)',
      tags: ['Air Freight', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Ningbo Branch',
      officeNameZh: 'Unitex 物流宁波分公司',
      city: 'Ningbo',
      cityZh: '宁波',
      email: 'ningbo@unitexlogistics.com',
      phone: '+86 574 0000 0000',
      address: 'Ningbo Port Area (placeholder)',
      tags: ['Ocean Freight', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Qingdao Branch',
      officeNameZh: 'Unitex 物流青岛分公司',
      city: 'Qingdao',
      cityZh: '青岛',
      email: 'qingdao@unitexlogistics.com',
      phone: '+86 532 0000 0000',
      address: 'Qingdao Port Area (placeholder)',
      tags: ['Ocean Freight', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Xiamen Branch',
      officeNameZh: 'Unitex 物流厦门分公司',
      city: 'Xiamen',
      cityZh: '厦门',
      email: 'xiamen@unitexlogistics.com',
      phone: '+86 592 0000 0000',
      address: 'Xiamen Port Area (placeholder)',
      tags: ['Ocean Freight', 'Air Freight']
    },
    {
      officeName: 'Unitex Logistics Guangzhou Branch',
      officeNameZh: 'Unitex 物流广州分公司',
      city: 'Guangzhou',
      cityZh: '广州',
      email: 'guangzhou@unitexlogistics.com',
      phone: '+86 20 0000 0000',
      address: 'Guangzhou Port Area (placeholder)',
      tags: ['Customs', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Tianjin Branch',
      officeNameZh: 'Unitex 物流天津分公司',
      city: 'Tianjin',
      cityZh: '天津',
      email: 'tianjin@unitexlogistics.com',
      phone: '+86 22 0000 0000',
      address: 'Tianjin Port Area (placeholder)',
      tags: ['Ocean Freight', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Dalian Branch',
      officeNameZh: 'Unitex 物流大连分公司',
      city: 'Dalian',
      cityZh: '大连',
      email: 'dalian@unitexlogistics.com',
      phone: '+86 411 0000 0000',
      address: 'Dalian Port Area (placeholder)',
      tags: ['Ocean Freight', 'Air Freight']
    },
    {
      officeName: 'Unitex Logistics Fuzhou Branch',
      officeNameZh: 'Unitex 物流福州分公司',
      city: 'Fuzhou',
      cityZh: '福州',
      email: 'fuzhou@unitexlogistics.com',
      phone: '+86 591 0000 0000',
      address: 'Fuzhou Port Area (placeholder)',
      tags: ['Customs', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Lianyungang Branch',
      officeNameZh: 'Unitex 物流连云港分公司',
      city: 'Lianyungang',
      cityZh: '连云港',
      email: 'lianyungang@unitexlogistics.com',
      phone: '+86 518 0000 0000',
      address: 'Lianyungang Port Area (placeholder)',
      tags: ['Ocean Freight', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Yantai Branch',
      officeNameZh: 'Unitex 物流烟台分公司',
      city: 'Yantai',
      cityZh: '烟台',
      email: 'yantai@unitexlogistics.com',
      phone: '+86 535 0000 0000',
      address: 'Yantai Port Area (placeholder)',
      tags: ['Air Freight', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Rizhao Branch',
      officeNameZh: 'Unitex 物流日照分公司',
      city: 'Rizhao',
      cityZh: '日照',
      email: 'rizhao@unitexlogistics.com',
      phone: '+86 633 0000 0000',
      address: 'Rizhao Port Area (placeholder)',
      tags: ['Ocean Freight', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Zhuhai Branch',
      officeNameZh: 'Unitex 物流珠海分公司',
      city: 'Zhuhai',
      cityZh: '珠海',
      email: 'zhuhai@unitexlogistics.com',
      phone: '+86 756 0000 0000',
      address: 'Zhuhai Port Area (placeholder)',
      tags: ['Warehousing', 'Customs']
    },
    {
      officeName: 'Unitex Logistics Nansha Branch',
      officeNameZh: 'Unitex 物流南沙分公司',
      city: 'Nansha',
      cityZh: '南沙',
      email: 'nansha@unitexlogistics.com',
      phone: '+86 20 0000 1000',
      address: 'Nansha Port Area (placeholder)',
      tags: ['Ocean Freight', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Suzhou Branch',
      officeNameZh: 'Unitex 物流苏州分公司',
      city: 'Suzhou',
      cityZh: '苏州',
      email: 'suzhou@unitexlogistics.com',
      phone: '+86 512 0000 0000',
      address: 'Suzhou Logistics Park (placeholder)',
      tags: ['Air Freight', 'Warehousing']
    },
    {
      officeName: 'Unitex Logistics Hong Kong Branch',
      officeNameZh: 'Unitex 物流香港分公司',
      city: 'Hong Kong',
      cityZh: '香港',
      email: 'hongkong@unitexlogistics.com',
      phone: '+852 0000 0000',
      address: 'Hong Kong Port Area (placeholder)',
      tags: ['Ocean Freight', 'Air Freight', 'Customs']
    }
  ];

  let activeServiceTag = 'all';

  const cityList = [...new Set(branchOffices.map((item) => item.city))];
  cityList.forEach((city) => {
    const office = branchOffices.find((item) => item.city === city);
    const option = document.createElement('option');
    option.value = city.toLowerCase();
    option.textContent = `${city} / ${office.cityZh}`;
    cityFilter.appendChild(option);
  });

  const serviceTags = [...new Set(branchOffices.flatMap((item) => item.tags))];
  const serviceTagClassMap = {
    'Ocean Freight': 'service-ocean',
    'Air Freight': 'service-air',
    Warehousing: 'service-warehouse',
    Customs: 'service-customs'
  };

  function getServiceTagClass(tag) {
    return serviceTagClassMap[tag] || 'service-default';
  }

  function renderServiceFilters() {
    serviceTagFilters.innerHTML = `
      <button type="button" class="tag-filter-btn service-all ${activeServiceTag === 'all' ? 'active' : ''}" data-tag="all">
        All Services / 全部服务
      </button>
      ${serviceTags
        .map(
          (tag) => `
      <button type="button" aria-pressed="${activeServiceTag === tag ? 'true' : 'false'}" class="tag-filter-btn ${getServiceTagClass(tag)} ${activeServiceTag === tag ? 'active' : ''}" data-tag="${tag}">
        ${tag}
      </button>`
        )
        .join('')}
    `;
  }

  function getFilteredBranches() {
    const cityValue = cityFilter.value;
    const keyword = officeSearch.value.trim().toLowerCase();

    return branchOffices.filter((item) => {
      const cityMatch = cityValue === 'all' || item.city.toLowerCase() === cityValue;
      const keywordMatch =
        !keyword ||
        item.officeName.toLowerCase().includes(keyword) ||
        item.officeNameZh.toLowerCase().includes(keyword);
      const serviceMatch = activeServiceTag === 'all' || item.tags.includes(activeServiceTag);
      return cityMatch && keywordMatch && serviceMatch;
    });
  }

  function renderCards() {
    const filtered = getFilteredBranches();
    branchCount.textContent = `Showing ${filtered.length} of ${branchOffices.length} offices / 当前显示 ${filtered.length} / ${branchOffices.length} 家办事处`;

    if (!filtered.length) {
      branchResults.innerHTML = '';
      branchEmpty.hidden = false;
      return;
    }

    branchEmpty.hidden = true;
    branchResults.innerHTML = filtered
      .map(
        (office) => `
      <article class="branch-office-card">
        <h4>${office.officeName}</h4>
        <p class="office-name-zh">${office.officeNameZh}</p>
        <ul class="office-meta">
          <li><b>City / Port:</b> ${office.city} / ${office.cityZh}</li>
          <li><b>Email:</b> <a href="mailto:${office.email}">${office.email}</a></li>
          <li><b>Phone:</b> ${office.phone}</li>
          <li><b>Address:</b> ${office.address}</li>
        </ul>
        <div class="office-tags">
          ${office.tags
            .map((tag) => `<button type="button" class="office-tag ${getServiceTagClass(tag)} ${activeServiceTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</button>`)
            .join('')}
        </div>
        <a class="btn office-cta" href="mailto:${office.email}?subject=${encodeURIComponent(`Contact ${office.officeName}`)}">Contact This Office / 联系该办事处</a>
      </article>`
      )
      .join('');
  }

  cityFilter.addEventListener('change', renderCards);
  officeSearch.addEventListener('input', renderCards);
  if (clearLocatorFilters) {
    clearLocatorFilters.addEventListener('click', () => {
      cityFilter.value = 'all';
      officeSearch.value = '';
      activeServiceTag = 'all';
      renderServiceFilters();
      renderCards();
    });
  }
  serviceTagFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tag]');
    if (!button) return;
    activeServiceTag = button.dataset.tag || 'all';
    renderServiceFilters();
    renderCards();
  });
  branchResults.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tag]');
    if (!button) return;
    activeServiceTag = button.dataset.tag || 'all';
    renderServiceFilters();
    renderCards();
  });

  renderServiceFilters();
  renderCards();
}

function initLanguageToggle() {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  if (!nav || !menu) return;

  // Convert "EN / 中文" labels into switchable spans
  const labelLinks = nav.querySelectorAll('.menu a, .nav > .btn');
  labelLinks.forEach((a) => {
    const txt = (a.textContent || '').trim();
    const m = txt.match(/^(.+?)\s*\/\s*(.+)$/);
    if (!m) return;
    const en = m[1].trim();
    const zh = m[2].trim();
    a.innerHTML = `<span data-lang="en">${en}</span><span data-lang="zh">${zh}</span>`;
  });

  let current = localStorage.getItem('siteLangMode') || 'en';
  document.documentElement.setAttribute('lang-mode', current === 'zh' ? 'zh' : 'en');

  let sw = nav.querySelector('.lang-switch');
  if (!sw) {
    sw = document.createElement('div');
    sw.className = 'lang-switch';
    sw.innerHTML = `
      <button type="button" class="lang-btn" data-lang-toggle="en">EN</button>
      <button type="button" class="lang-btn" data-lang-toggle="zh">中</button>
    `;
    const navBtn = nav.querySelector(':scope > .btn');
    if (navBtn) nav.insertBefore(sw, navBtn);
    else nav.appendChild(sw);
  }

  const sync = () => {
    sw.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-lang-toggle') === current);
    });
  };

  sw.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang-toggle]');
    if (!b) return;
    current = b.getAttribute('data-lang-toggle') || 'en';
    document.documentElement.setAttribute('lang-mode', current === 'zh' ? 'zh' : 'en');
    localStorage.setItem('siteLangMode', current);
    sync();
  });

  sync();
}

function initNavMenu() {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  if (!nav || !menu) return;

  let toggle = nav.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="hamburger" aria-hidden="true"><span></span><span></span><span></span></span><span class="menu-label">Menu</span>';
    nav.appendChild(toggle);
  }

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const next = !menu.classList.contains('open');
    menu.classList.toggle('open', next);
    toggle.setAttribute('aria-expanded', String(next));
  });

  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 920px)').matches) closeMenu();
    });
  });

  menu.querySelectorAll('.nav-dropdown > a').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const parent = trigger.closest('.nav-dropdown');
      if (!parent) return;
      if (!window.matchMedia('(max-width: 920px)').matches) return;
      e.preventDefault();
      const next = !parent.classList.contains('open');
      menu.querySelectorAll('.nav-dropdown').forEach((d) => d.classList.remove('open'));
      parent.classList.toggle('open', next);
    });
  });
}

function injectFloatingCTA() {
  if (document.querySelector('.float-quote-btn')) return;
  const a = document.createElement('a');
  a.href = 'contact.html';
  a.className = 'float-quote-btn';
  a.textContent = 'Get Quote / 获取报价';
  document.body.appendChild(a);
}

async function api(method, url, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

function setAuthMsg(msg, ok = true) {
  const el = document.querySelector('#authMsg');
  if (!el) return;
  el.innerHTML = `<span class="${ok ? 'result-ok' : 'result-warn'}">${msg}</span>`;
}

function setProfileMsg(msg, ok = true) {
  const el = document.querySelector('#profileMsg');
  if (!el) return;
  el.innerHTML = `<span class="${ok ? 'result-ok' : 'result-warn'}">${msg}</span>`;
}

function setAdminMsg(msg, ok = true) {
  const el = document.querySelector('#adminMsg');
  if (!el) return;
  el.innerHTML = `<span class="${ok ? 'result-ok' : 'result-warn'}">${msg}</span>`;
}

function toggleAdminPanel() {
  const panel = document.querySelector('#adminPanel');
  if (!panel) return;
  const canAdmin = ['ops', 'admin'].includes(currentProfile?.role);
  panel.style.display = canAdmin ? 'block' : 'none';
}

async function loadProfile() {
  if (!authToken) return;
  try {
    const r = await api('GET', '/api/profile');
    currentProfile = r.profile || null;
    if (!currentProfile?.company_id) {
      setProfileMsg('Please complete onboarding (name + company) before creating orders. / 请先完成开户（姓名+公司）');
    } else {
      setProfileMsg(`Profile ready. Role: ${currentProfile.role || 'customer'} / 账户已就绪`);
    }
    toggleAdminPanel();
    if (['ops', 'admin'].includes(currentProfile?.role)) {
      await renderAllOrdersForAdmin();
    }
  } catch (err) {
    setProfileMsg(err.message, false);
  }
}

async function initAuth() {
  if (!window.supabase) {
    setAuthMsg('Supabase SDK not loaded', false);
    return;
  }

  let supabaseUrl = window.UNITEX_SUPABASE_URL || '';
  let supabaseAnonKey = window.UNITEX_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    try {
      const cfg = await api('GET', '/api/public-config');
      supabaseUrl = cfg.supabaseUrl || '';
      supabaseAnonKey = cfg.supabaseAnonKey || '';
    } catch (_e) {}
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    setAuthMsg('Supabase config missing. Set SUPABASE_URL + SUPABASE_ANON_KEY in Vercel. / 缺少Supabase配置', false);
    return;
  }

  supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const { data } = await supabaseClient.auth.getSession();
  authToken = data.session?.access_token || null;
  currentUser = data.session?.user || null;
  if (currentUser) {
    setAuthMsg(`Signed in as ${currentUser.email}`);
    await loadProfile();
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    authToken = session?.access_token || null;
    currentUser = session?.user || null;
    currentProfile = null;
    if (currentUser) {
      setAuthMsg(`Signed in as ${currentUser.email}`);
      await loadProfile();
    } else {
      setAuthMsg('Signed out / 已退出', true);
      setProfileMsg('Not signed in / 未登录', false);
      toggleAdminPanel();
    }
  });

  const authForm = document.querySelector('#authForm');
  const profileForm = document.querySelector('#profileForm');
  const signUpBtn = document.querySelector('#signUpBtn');
  const signOutBtn = document.querySelector('#signOutBtn');

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(authForm);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');

      if (!email) return setAuthMsg('Email is required / 请输入邮箱', false);
      if (!password) return setAuthMsg('Password is required / 请输入密码', false);

      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = String(error.message || 'Sign in failed / 登录失败');
        if (/anonymous sign-?ins? are disabled/i.test(msg)) {
          return setAuthMsg('Login failed: Anonymous sign-ins are disabled. Please verify Email provider is enabled in Supabase Auth, then re-enter email/password and try again. / 登录失败：匿名登录被禁用。请在 Supabase Auth 中确认已启用 Email 登录，然后重新输入邮箱和密码再试。', false);
        }
        if (/invalid login credentials/i.test(msg)) {
          return setAuthMsg('Invalid email or password. Please check and retry. / 邮箱或密码错误，请检查后重试。', false);
        }
        return setAuthMsg(msg, false);
      }
      setAuthMsg('Sign in success / 登录成功');
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return setProfileMsg('Please sign in first / 请先登录', false);
      const fd = new FormData(profileForm);
      try {
        await api('POST', '/api/profile', {
          fullName: fd.get('fullName'),
          companyName: fd.get('companyName')
        });
        setProfileMsg('Onboarding completed / 开户完成');
        await loadProfile();
      } catch (err) {
        setProfileMsg(err.message, false);
      }
    });
  }

  if (signUpBtn) {
    signUpBtn.addEventListener('click', async () => {
      try {
        const fd = new FormData(document.querySelector('#authForm'));
        const email = String(fd.get('email') || '').trim();
        const password = String(fd.get('password') || '');

        if (!email) return setAuthMsg('Email is required / 请输入邮箱', false);
        if (!password || password.length < 6) return setAuthMsg('Password must be at least 6 characters / 密码至少6位', false);

        const r = await api('POST', '/api/sign-up', { email, password });

        const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (signInError) {
          setAuthMsg((r.message || 'Sign up success / 注册成功') + ' · Auto sign-in failed, please sign in manually. / 自动登录失败，请手动登录', false);
          return;
        }

        setAuthMsg('Sign up + auto sign-in success / 注册并自动登录成功');
      } catch (err) {
        setAuthMsg(err.message || 'Sign up failed / 注册失败', false);
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      setAuthMsg('Signed out / 已退出');
    });
  }
}

function initPortal() {
  const quickQuoteForm = document.querySelector('#quickQuoteForm');
  const quoteReply = document.querySelector('#quoteReply');
  if (quickQuoteForm && quoteReply) {
    quickQuoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(quickQuoteForm);
      try {
        const r = await api('POST', '/api/inquiry', {
          companyName: fd.get('company'),
          contactName: fd.get('contactName'),
          email: fd.get('email'),
          origin: fd.get('origin'),
          destination: fd.get('destination'),
          cargoDetails: fd.get('details')
        });
        quoteReply.innerHTML = `<span class="result-ok">✅ ${r.autoReply} (${r.inquiryNo})</span>`;
        quickQuoteForm.reset();
      } catch (err) { quoteReply.innerHTML = `<span class="result-warn">${err.message}</span>`; }
    });
  }

  const scheduleForm = document.querySelector('#scheduleForm');
  const scheduleResult = document.querySelector('#scheduleResult');
  if (scheduleForm && scheduleResult) {
    scheduleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(scheduleForm);
      try {
        const q = new URLSearchParams({ origin: fd.get('origin'), destination: fd.get('destination') }).toString();
        const r = await api('GET', `/api/schedule?${q}`);
        if (!r.items?.length) return scheduleResult.innerHTML = '<span class="result-warn">No schedule found / 未找到船期</span>';
        scheduleResult.innerHTML = r.items.map(x => `<div class="card" style="margin-top:8px"><b>${x.vessel}</b><br>ETD ${x.etd} | ETA ${x.eta}<br>${x.origin} → ${x.destination}</div>`).join('');
      } catch (err) { scheduleResult.innerHTML = `<span class="result-warn">${err.message}</span>`; }
    });
  }

  const trackForm = document.querySelector('#trackForm');
  const trackResult = document.querySelector('#trackResult');
  if (trackForm && trackResult) {
    trackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const id = String(new FormData(trackForm).get('trackId') || '').trim();
        const r = await api('GET', `/api/track?id=${encodeURIComponent(id)}`);
        const events = (r.events || []).map(ev => `<li>${ev.event_text} (${new Date(ev.created_at).toLocaleString()})</li>`).join('');
        trackResult.innerHTML = `<span class="result-ok">${r.order.order_no} · ${r.order.status}</span><br>${r.order.origin} → ${r.order.destination}<ul class="timeline">${events || '<li>No events</li>'}</ul>`;
      } catch (err) { trackResult.innerHTML = `<span class="result-warn">${err.message}</span>`; }
    });
  }

  const orderForm = document.querySelector('#orderForm');
  const orderCreateMsg = document.querySelector('#orderCreateMsg');
  if (orderForm && orderCreateMsg) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return orderCreateMsg.innerHTML = '<span class="result-warn">Please sign in first / 请先登录</span>';
      if (!currentProfile?.company_id) return orderCreateMsg.innerHTML = '<span class="result-warn">Please complete onboarding first / 请先完成开户</span>';
      try {
        const fd = new FormData(orderForm);
        const r = await api('POST', '/api/orders-create', {
          customerName: fd.get('customer'),
          companyName: fd.get('company'),
          mode: fd.get('mode'),
          origin: fd.get('origin'),
          destination: fd.get('destination'),
          etaTarget: fd.get('eta'),
          cargoDetails: fd.get('cargo')
        });
        orderCreateMsg.innerHTML = `<span class="result-ok">✅ Order created: ${r.orderNo}</span>`;
        orderForm.reset();
      } catch (err) { orderCreateMsg.innerHTML = `<span class="result-warn">${err.message}</span>`; }
    });
  }

  const orderLookupForm = document.querySelector('#orderLookupForm');
  const orderLookupResult = document.querySelector('#orderLookupResult');
  if (orderLookupForm && orderLookupResult) {
    orderLookupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const id = String(new FormData(orderLookupForm).get('orderId') || '').trim();
        const r = await api('GET', `/api/track?id=${encodeURIComponent(id)}`);
        orderLookupResult.innerHTML = `<span class="result-ok">${r.order.order_no} · ${r.order.status}</span><br>${r.order.origin} → ${r.order.destination}`;
      } catch (err) { orderLookupResult.innerHTML = `<span class="result-warn">${err.message}</span>`; }
    });
  }

  const loadMyOrdersBtn = document.querySelector('#loadMyOrdersBtn');
  if (loadMyOrdersBtn) {
    loadMyOrdersBtn.addEventListener('click', async () => {
      await renderOrders();
    });
  }
}

async function renderOrders() {
  const box = document.querySelector('#myOrders');
  if (!box) return;
  if (!currentUser) {
    box.innerHTML = '<article class="card"><p>Please sign in first / 请先登录</p></article>';
    return;
  }
  if (!currentProfile?.company_id && !['admin','ops'].includes(currentProfile?.role)) {
    box.innerHTML = '<article class="card"><p>Please complete onboarding first / 请先完成开户</p></article>';
    return;
  }
  try {
    const r = await api('GET', '/api/my-orders');
    const orders = r.items || [];
    if (!orders.length) return box.innerHTML = '<article class="card"><p>No orders found / 暂无订单</p></article>';
    box.innerHTML = orders.slice(0, 12).map(o => `<article class="card"><h3>${o.order_no}</h3><p>${o.status}<br>${o.origin} → ${o.destination}<br>${o.mode || ''} | ETA ${o.eta_target || '-'}</p></article>`).join('');
  } catch (err) {
    box.innerHTML = `<article class="card"><p class="result-warn">${err.message}</p></article>`;
  }
}

async function renderAllOrdersForAdmin() {
  const box = document.querySelector('#allOrders');
  if (!box) return;
  if (!['ops', 'admin'].includes(currentProfile?.role)) return;
  try {
    const r = await api('GET', '/api/my-orders');
    const orders = r.items || [];
    if (!orders.length) return box.innerHTML = '<article class="card"><p>No orders / 暂无订单</p></article>';
    box.innerHTML = orders.slice(0, 24).map(o => `<article class="card"><h3>${o.order_no}</h3><p>${o.status}<br>${o.origin} → ${o.destination}<br>${o.mode || ''} | ETA ${o.eta_target || '-'}</p></article>`).join('');
  } catch (err) {
    box.innerHTML = `<article class="card"><p class="result-warn">${err.message}</p></article>`;
  }
}

function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function initAdminPanel() {
  const form = document.querySelector('#adminUpdateForm');
  const refreshBtn = document.querySelector('#refreshAllOrders');
  const bulkScheduleBtn = document.querySelector('#bulkScheduleBtn');
  const bulkOrderBtn = document.querySelector('#bulkOrderBtn');
  const downloadScheduleTemplate = document.querySelector('#downloadScheduleTemplate');
  const downloadOrderTemplate = document.querySelector('#downloadOrderTemplate');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!['ops', 'admin'].includes(currentProfile?.role)) return setAdminMsg('Forbidden: ops/admin only', false);
      const fd = new FormData(form);
      try {
        const r = await api('POST', '/api/admin-order-event', {
          orderNo: fd.get('orderNo'),
          status: fd.get('status'),
          eventType: fd.get('eventType') || 'status_update',
          eventText: fd.get('eventText')
        });
        setAdminMsg(r.message || 'Updated');
        await renderAllOrdersForAdmin();
        form.reset();
      } catch (err) {
        setAdminMsg(err.message, false);
      }
    });
  }

  if (downloadScheduleTemplate) {
    downloadScheduleTemplate.addEventListener('click', () => {
      const csv = 'origin,destination,vessel,etd,eta,active\nshenzhen,singapore,UTX Pacific,2026-03-10,2026-03-14,true\nshanghai,jakarta,UTX Aurora,2026-03-11,2026-03-16,true';
      downloadCsv('schedule-template.csv', csv);
    });
  }

  if (bulkScheduleBtn) {
    bulkScheduleBtn.addEventListener('click', async () => {
      if (!['ops', 'admin'].includes(currentProfile?.role)) return setAdminMsg('Forbidden: ops/admin only', false);
      const csv = (document.querySelector('#bulkScheduleCsv')?.value || '').trim();
      if (!csv) return setAdminMsg('Please paste schedule CSV / 请粘贴船期CSV', false);
      try {
        const r = await api('POST', '/api/admin-bulk-schedules', { csv });
        setAdminMsg(`Imported schedules: ${r.inserted}`);
      } catch (err) {
        setAdminMsg(err.message, false);
      }
    });
  }

  if (downloadOrderTemplate) {
    downloadOrderTemplate.addEventListener('click', () => {
      const csv = 'order_no,status,event_type,event_text\nUTX12345678,in_transit,status_update,Departed Shenzhen\nUTX12345679,arrived_port,status_update,Arrived Singapore Port';
      downloadCsv('order-update-template.csv', csv);
    });
  }

  if (bulkOrderBtn) {
    bulkOrderBtn.addEventListener('click', async () => {
      if (!['ops', 'admin'].includes(currentProfile?.role)) return setAdminMsg('Forbidden: ops/admin only', false);
      const csv = (document.querySelector('#bulkOrderCsv')?.value || '').trim();
      if (!csv) return setAdminMsg('Please paste order CSV / 请粘贴订单CSV', false);
      try {
        const r = await api('POST', '/api/admin-bulk-order-events', { csv });
        setAdminMsg(`Bulk updated orders: ${r.updated}`);
        await renderAllOrdersForAdmin();
      } catch (err) {
        setAdminMsg(err.message, false);
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await renderAllOrdersForAdmin();
    });
  }
}

initLanguageToggle();
initNavMenu();
currentPath();
bindContactForm();
initBranchLocator();
initAuth();
initPortal();
initAdminPanel();
injectFloatingCTA();
