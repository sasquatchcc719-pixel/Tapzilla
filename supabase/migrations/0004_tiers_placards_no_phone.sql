-- Tier rework: placard locations replace call capture as the growth axis.
-- (No telephony integration, ever — founder decision 2026-07-13.)
alter table public.plans add column if not exists max_locations int not null default 0;

update public.plans set
  max_locations = 0,
  features = features - 'call_capture' || '{"placards":false}'::jsonb
where id = 'starter';

update public.plans set
  max_locations = 3,
  features = features - 'call_capture' || '{"placards":true}'::jsonb
where id = 'pro';

update public.plans set
  max_locations = 15,
  features = features - 'call_capture' || '{"placards":true}'::jsonb
where id = 'zilla';
