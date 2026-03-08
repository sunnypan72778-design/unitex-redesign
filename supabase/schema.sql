create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id),
  role text not null default 'customer', -- customer | ops | admin
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_no text unique not null,
  company_id uuid references public.companies(id),
  contact_name text,
  email text,
  origin text,
  destination text,
  cargo_details text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  vessel text not null,
  etd date not null,
  eta date not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  company_id uuid references public.companies(id),
  created_by uuid references auth.users(id),
  mode text,
  origin text,
  destination text,
  eta_target date,
  cargo_details text,
  status text default 'order_created',
  created_at timestamptz default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  event_type text not null,
  event_text text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.tracking_refs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  ref_type text not null, -- bl | container | custom
  ref_value text not null,
  unique(ref_type, ref_value)
);

create index if not exists idx_orders_company on public.orders(company_id);
create index if not exists idx_inquiries_company on public.inquiries(company_id);
create index if not exists idx_schedule_route on public.schedules(origin, destination);
