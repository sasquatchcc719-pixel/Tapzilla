-- Tapzilla v2 schema. Archives v1 tables (no drops), creates the smart-card
-- platform schema with RLS enabled on every table from day one.
-- Public pages read only card_pages/cards; business PII is never anon-readable.

-- ── 1. Archive v1 ────────────────────────────────────────────────────────────
create schema if not exists v1_archive;

do $$
declare t text;
begin
  foreach t in array array[
    'billing_events','company_settings','leads','conversations','scans',
    'qr_codes','company_faqs','services','company_users','companies',
    'industries','jobs','sightings'
  ] loop
    if exists (select 1 from information_schema.tables
               where table_schema = 'public' and table_name = t) then
      execute format('alter table public.%I set schema v1_archive', t);
    end if;
  end loop;
end $$;

-- ── 2. Helpers ───────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ── 3. Catalog: plans & products (admin-editable, public-readable) ──────────
create table public.plans (
  id text primary key,                      -- 'starter' | 'pro' | 'zilla'
  name text not null,
  monthly_price_cents int not null,
  annual_price_cents int not null,
  stripe_monthly_price_id text,
  stripe_annual_price_id text,
  max_pages int not null,
  max_cards int,                            -- null = unlimited
  features jsonb not null default '{}',     -- flags per PRICING-STRATEGY.md
  hardware_discount_pct int not null default 0,
  sort int not null default 0,
  active boolean not null default true
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  description text,
  kind text not null check (kind in ('card','magnet','pack')),
  units int not null default 1,             -- cards included in this SKU
  unit_price_cents int not null,
  sort int not null default 0,
  active boolean not null default true
);

-- ── 4. Tenancy ───────────────────────────────────────────────────────────────
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null, -- null = platform demo
  name text not null,
  slug text unique not null,
  industry text,
  phone text,
  email text,
  website text,
  google_review_url text,
  booking_url text,
  logo_url text,
  brand jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger businesses_updated before update on public.businesses
  for each row execute function public.set_updated_at();

create table public.card_pages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  slug text unique not null,
  config jsonb not null default '{}',       -- versioned block document (zod-validated in app)
  config_version int not null default 1,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index card_pages_business_idx on public.card_pages(business_id);
create trigger card_pages_updated before update on public.card_pages
  for each row execute function public.set_updated_at();

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  card_code text unique not null,           -- unguessable short code on the chip
  business_id uuid not null references public.businesses(id) on delete cascade,
  page_id uuid not null references public.card_pages(id) on delete cascade,
  product_type text not null default 'card' check (product_type in ('card','magnet','placard')),
  label text,                               -- "Front desk", "Truck #2"
  status text not null default 'active' check (status in ('active','disabled')),
  created_at timestamptz not null default now()
);
create index cards_page_idx on public.cards(page_id);
create index cards_business_idx on public.cards(business_id);

create table public.card_designs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.card_pages(id) on delete cascade,
  source text not null default 'template' check (source in ('template','upload','editor')),
  template_id text,
  design jsonb not null default '{}',       -- slot values for template source
  front_asset_url text,
  back_asset_url text,
  preflight jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index card_designs_page_idx on public.card_designs(page_id);
create trigger card_designs_updated before update on public.card_designs
  for each row execute function public.set_updated_at();

-- ── 5. Analytics (collect always; views gated by plan in app) ───────────────
create table public.taps (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  page_id uuid not null references public.card_pages(id) on delete cascade,
  card_id uuid references public.cards(id) on delete set null,
  visitor_key uuid,                         -- first-party cookie id
  is_returning boolean not null default false,
  medium text not null default 'direct' check (medium in ('nfc','qr','share','direct')),
  device_type text,                         -- mobile | tablet | desktop
  os text,
  browser text,
  city text,
  region text,
  country text,
  duration_ms int,
  scroll_depth int,                         -- 0-100
  created_at timestamptz not null default now()
);
create index taps_business_time_idx on public.taps(business_id, created_at desc);
create index taps_card_idx on public.taps(card_id);

create table public.tap_events (
  id uuid primary key default gen_random_uuid(),
  tap_id uuid not null references public.taps(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  event_type text not null,                 -- button_click, coupon_copy, form_started, ...
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index tap_events_tap_idx on public.tap_events(tap_id);
create index tap_events_business_time_idx on public.tap_events(business_id, created_at desc);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  page_id uuid references public.card_pages(id) on delete set null,
  tap_id uuid references public.taps(id) on delete set null,
  source text not null default 'form' check (source in ('form','call','sms')),
  name text,
  phone text,
  email text,
  address text,
  service text,
  message text,
  photo_url text,
  sms_consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','won','lost')),
  value_cents int,
  enrichment jsonb,
  score int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_business_time_idx on public.leads(business_id, created_at desc);
create trigger leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

-- ── 6. Commerce ──────────────────────────────────────────────────────────────
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique not null references public.businesses(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger subscriptions_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  status text not null default 'paid' check
    (status in ('paid','artwork_ready','sent_to_vendor','shipped','delivered','canceled')),
  provider text not null default 'manual',
  provider_order_id text,
  tracking_number text,
  tracking_url text,
  shipping_address jsonb,
  subtotal_cents int not null default 0,
  discount_cents int not null default 0,
  total_cents int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_business_idx on public.orders(business_id);
create trigger orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity int not null default 1,
  unit_price_cents int not null
);
create index order_items_order_idx on public.order_items(order_id);

create table public.fulfillment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
create index fulfillment_events_order_idx on public.fulfillment_events(order_id);

-- ── 7. Call & text capture (Phase 5b consumers; schema ready now) ───────────
create table public.tracking_numbers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  card_id uuid references public.cards(id) on delete set null,
  phone_number text unique not null,
  forward_to text not null,
  missed_call_text_back text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  tracking_number_id uuid references public.tracking_numbers(id) on delete set null,
  card_id uuid references public.cards(id) on delete set null,
  from_number text,
  status text,                              -- completed | missed | voicemail
  duration_s int,
  recording_url text,
  transcript text,
  summary text,
  started_at timestamptz,
  created_at timestamptz not null default now()
);
create index calls_business_time_idx on public.calls(business_id, created_at desc);

create table public.sms_messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  tracking_number_id uuid references public.tracking_numbers(id) on delete set null,
  direction text not null check (direction in ('inbound','outbound')),
  from_number text,
  body text,
  created_at timestamptz not null default now()
);

create table public.enrichment_lookups (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  vendor text not null,
  kind text not null,
  cost_cents int,
  result jsonb,
  created_at timestamptz not null default now()
);

-- ── 8. RLS ───────────────────────────────────────────────────────────────────
alter table public.plans enable row level security;
alter table public.products enable row level security;
alter table public.businesses enable row level security;
alter table public.card_pages enable row level security;
alter table public.cards enable row level security;
alter table public.card_designs enable row level security;
alter table public.taps enable row level security;
alter table public.tap_events enable row level security;
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.fulfillment_events enable row level security;
alter table public.tracking_numbers enable row level security;
alter table public.calls enable row level security;
alter table public.sms_messages enable row level security;
alter table public.enrichment_lookups enable row level security;

create or replace function public.owns_business(bid uuid)
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from businesses b where b.id = bid and b.owner_id = auth.uid()) $$;

-- catalog: anyone can read active rows; writes are service-role only
create policy plans_public_read on public.plans for select using (active);
create policy products_public_read on public.products for select using (active);

-- businesses: owner only (public pages never read this table directly —
-- everything public is snapshotted into card_pages.config at publish)
create policy businesses_owner_all on public.businesses
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- card_pages: anon can read published; owner full access
create policy card_pages_public_read on public.card_pages
  for select using (status = 'published' or public.owns_business(business_id));
create policy card_pages_owner_write on public.card_pages
  for insert with check (public.owns_business(business_id));
create policy card_pages_owner_update on public.card_pages
  for update using (public.owns_business(business_id));
create policy card_pages_owner_delete on public.card_pages
  for delete using (public.owns_business(business_id));

-- cards: anon can resolve active card codes (codes are unguessable); owner full
create policy cards_public_read on public.cards
  for select using (status = 'active' or public.owns_business(business_id));
create policy cards_owner_write on public.cards
  for insert with check (public.owns_business(business_id));
create policy cards_owner_update on public.cards
  for update using (public.owns_business(business_id));

-- card_designs: owner only
create policy card_designs_owner_all on public.card_designs
  for all using (public.owns_business((select business_id from public.card_pages p where p.id = page_id)))
  with check (public.owns_business((select business_id from public.card_pages p where p.id = page_id)));

-- taps/tap_events: public telemetry — anyone may insert, only owner reads
create policy taps_public_insert on public.taps for insert with check (true);
create policy taps_owner_read on public.taps for select using (public.owns_business(business_id));
create policy tap_events_public_insert on public.tap_events for insert with check (true);
create policy tap_events_owner_read on public.tap_events for select using (public.owns_business(business_id));

-- leads: public form submission inserts; owner reads/updates
create policy leads_public_insert on public.leads for insert with check (source = 'form');
create policy leads_owner_read on public.leads for select using (public.owns_business(business_id));
create policy leads_owner_update on public.leads for update using (public.owns_business(business_id));

-- commerce + capture tables: owner read; writes are server-side (service role)
create policy subscriptions_owner_read on public.subscriptions for select using (public.owns_business(business_id));
create policy orders_owner_read on public.orders for select using (public.owns_business(business_id));
create policy order_items_owner_read on public.order_items
  for select using (public.owns_business((select business_id from public.orders o where o.id = order_id)));
create policy fulfillment_events_owner_read on public.fulfillment_events
  for select using (public.owns_business((select business_id from public.orders o where o.id = order_id)));
create policy tracking_numbers_owner_read on public.tracking_numbers for select using (public.owns_business(business_id));
create policy calls_owner_read on public.calls for select using (public.owns_business(business_id));
create policy sms_messages_owner_read on public.sms_messages for select using (public.owns_business(business_id));
create policy enrichment_lookups_owner_read on public.enrichment_lookups for select using (public.owns_business(business_id));

-- ── 9. Seed: plans & products (prices per PRICING-STRATEGY.md) ──────────────
insert into public.plans
  (id, name, monthly_price_cents, annual_price_cents, max_pages, max_cards, features, hardware_discount_pct, sort) values
  ('starter', 'Starter', 900, 9000, 1, 2,
   '{"lead_form":false,"per_card_analytics":false,"badge_removed":false,"ai_redesign":false,"webhooks":false,"call_capture":false,"enrichment":false,"csv_export":false,"priority_fulfillment":false}', 0, 1),
  ('pro', 'Pro', 2900, 29000, 1, 10,
   '{"lead_form":true,"per_card_analytics":true,"badge_removed":true,"ai_redesign":true,"webhooks":false,"call_capture":false,"enrichment":false,"csv_export":true,"priority_fulfillment":false}', 10, 2),
  ('zilla', 'Zilla', 9900, 99000, 5, null,
   '{"lead_form":true,"per_card_analytics":true,"badge_removed":true,"ai_redesign":true,"webhooks":true,"call_capture":true,"enrichment":true,"csv_export":true,"priority_fulfillment":true}', 20, 3);

insert into public.products (sku, name, description, kind, units, unit_price_cents, sort) values
  ('card-magnet-1',  'Smart Card + Magnet',        'NFC business card with magnetic back', 'card', 1,  3500, 1),
  ('card-magnet-3',  'Smart Card 3-Pack',          'Three NFC cards with magnetic backs',  'pack', 3,  7900, 2),
  ('card-magnet-10', 'Smart Card 10-Pack',         'Ten NFC cards with magnetic backs',    'pack', 10, 19900, 3);
