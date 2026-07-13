-- Builder AI token usage log (admin-visible cost tracking per MASTER-PROMPT).
create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  session_key text,
  model text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cache_read_tokens int not null default 0,
  turns int not null default 1,
  created_at timestamptz not null default now()
);
create index ai_usage_time_idx on public.ai_usage(created_at desc);
alter table public.ai_usage enable row level security;
-- Telemetry: server inserts (anon key pre-service-role); reads are admin/service only.
create policy ai_usage_public_insert on public.ai_usage for insert with check (true);
