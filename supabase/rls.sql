alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.inquiries enable row level security;
alter table public.schedules enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.tracking_refs enable row level security;

-- helper: current role
create or replace function public.my_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

-- profiles
create policy "profile self read" on public.profiles
for select using (id = auth.uid() or public.my_role() in ('ops','admin'));

-- companies
create policy "company own read" on public.companies
for select using (
  id = (select company_id from public.profiles where id = auth.uid())
  or public.my_role() in ('ops','admin')
);

-- inquiries
create policy "inquiry own read" on public.inquiries
for select using (
  company_id = (select company_id from public.profiles where id = auth.uid())
  or public.my_role() in ('ops','admin')
);
create policy "inquiry insert" on public.inquiries
for insert with check (auth.uid() is not null);

-- schedules (all logged-in can read)
create policy "schedule read" on public.schedules
for select using (auth.uid() is not null);

-- orders
create policy "order own read" on public.orders
for select using (
  company_id = (select company_id from public.profiles where id = auth.uid())
  or public.my_role() in ('ops','admin')
);
create policy "order insert customer" on public.orders
for insert with check (auth.uid() is not null);

-- order_events
create policy "event read by order access" on public.order_events
for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.company_id = (select company_id from public.profiles where id = auth.uid()) or public.my_role() in ('ops','admin'))
  )
);

-- tracking_refs
create policy "tracking read by order access" on public.tracking_refs
for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.company_id = (select company_id from public.profiles where id = auth.uid()) or public.my_role() in ('ops','admin'))
  )
);
