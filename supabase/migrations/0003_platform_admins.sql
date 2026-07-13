-- Platform admin role via RLS (no service key needed for the admin UI).
create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;
create policy platform_admins_self_read on public.platform_admins
  for select using (user_id = auth.uid());

create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from platform_admins where user_id = auth.uid()) $$;

create policy businesses_admin_read on public.businesses for select using (public.is_platform_admin());
create policy card_pages_admin_read on public.card_pages for select using (public.is_platform_admin());
create policy cards_admin_read on public.cards for select using (public.is_platform_admin());
create policy taps_admin_read on public.taps for select using (public.is_platform_admin());
create policy tap_events_admin_read on public.tap_events for select using (public.is_platform_admin());
create policy leads_admin_read on public.leads for select using (public.is_platform_admin());
create policy subscriptions_admin_read on public.subscriptions for select using (public.is_platform_admin());
create policy orders_admin_all on public.orders for all using (public.is_platform_admin());
create policy order_items_admin_read on public.order_items for select using (public.is_platform_admin());
create policy fulfillment_events_admin_all on public.fulfillment_events for all using (public.is_platform_admin());
create policy ai_usage_admin_read on public.ai_usage for select using (public.is_platform_admin());

insert into public.platform_admins (user_id)
select id from auth.users where email = 'test@tapzilla.dev'
on conflict do nothing;
