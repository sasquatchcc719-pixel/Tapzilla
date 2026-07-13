import type { SupabaseClient } from "@supabase/supabase-js";

/** Server-side analytics aggregation for the dashboard. All queries run under
 * the owner's RLS, so this can only ever see the caller's own business. */

export type DashboardData = {
  business: { id: string; name: string };
  planId: string;
  features: Record<string, boolean>;
  page: { id: string; slug: string; status: string } | null;
  taps30: number;
  tapsPrev30: number;
  tapsByDay: { day: string; count: number }[];
  mediumSplit: Record<string, number>;
  deviceSplit: Record<string, number>;
  returningPct: number;
  buttonClicks: { button: string; count: number }[];
  perCard: { cardId: string; label: string; code: string; taps: number }[];
  leads: {
    id: string;
    name: string | null;
    phone: string | null;
    service: string | null;
    message: string | null;
    status: string;
    value_cents: number | null;
    created_at: string;
  }[];
  wonValueCents: number;
};

export async function loadDashboard(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardData | null> {
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();
  if (!business) return null;

  const [{ data: sub }, { data: page }, { data: cards }] = await Promise.all([
    supabase.from("subscriptions").select("plan_id").eq("business_id", business.id).maybeSingle(),
    supabase
      .from("card_pages")
      .select("id, slug, status")
      .eq("business_id", business.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("cards").select("id, label, card_code").eq("business_id", business.id),
  ]);

  const planId = sub?.plan_id ?? "starter";
  const { data: plan } = await supabase.from("plans").select("features").eq("id", planId).maybeSingle();
  const features = (plan?.features as Record<string, boolean>) ?? {};

  const since30 = new Date(Date.now() - 30 * 86400_000).toISOString();
  const since60 = new Date(Date.now() - 60 * 86400_000).toISOString();

  const [{ data: taps }, { data: prevTaps }, { data: events }, { data: leads }] = await Promise.all([
    supabase
      .from("taps")
      .select("id, card_id, medium, device_type, is_returning, created_at")
      .eq("business_id", business.id)
      .gte("created_at", since30)
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("taps")
      .select("id")
      .eq("business_id", business.id)
      .gte("created_at", since60)
      .lt("created_at", since30)
      .limit(5000),
    supabase
      .from("tap_events")
      .select("event_type, payload, created_at")
      .eq("business_id", business.id)
      .eq("event_type", "button_click")
      .gte("created_at", since30)
      .limit(5000),
    supabase
      .from("leads")
      .select("id, name, phone, service, message, status, value_cents, created_at")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const tapsByDayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000);
    tapsByDayMap.set(d.toISOString().slice(0, 10), 0);
  }
  const mediumSplit: Record<string, number> = {};
  const deviceSplit: Record<string, number> = {};
  let returning = 0;
  const perCardMap = new Map<string, number>();

  for (const t of taps ?? []) {
    const day = t.created_at.slice(0, 10);
    if (tapsByDayMap.has(day)) tapsByDayMap.set(day, (tapsByDayMap.get(day) ?? 0) + 1);
    mediumSplit[t.medium] = (mediumSplit[t.medium] ?? 0) + 1;
    if (t.device_type) deviceSplit[t.device_type] = (deviceSplit[t.device_type] ?? 0) + 1;
    if (t.is_returning) returning++;
    if (t.card_id) perCardMap.set(t.card_id, (perCardMap.get(t.card_id) ?? 0) + 1);
  }

  const clickMap = new Map<string, number>();
  for (const e of events ?? []) {
    const btn = String((e.payload as Record<string, unknown>)?.button ?? "other");
    clickMap.set(btn, (clickMap.get(btn) ?? 0) + 1);
  }

  const wonValueCents = (leads ?? [])
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.value_cents ?? 0), 0);

  return {
    business,
    planId,
    features,
    page: page ?? null,
    taps30: taps?.length ?? 0,
    tapsPrev30: prevTaps?.length ?? 0,
    tapsByDay: Array.from(tapsByDayMap.entries()).map(([day, count]) => ({ day, count })),
    mediumSplit,
    deviceSplit,
    returningPct: taps?.length ? Math.round((returning / taps.length) * 100) : 0,
    buttonClicks: Array.from(clickMap.entries())
      .map(([button, count]) => ({ button, count }))
      .sort((a, b) => b.count - a.count),
    perCard: (cards ?? []).map((c) => ({
      cardId: c.id,
      label: c.label ?? "Card",
      code: c.card_code,
      taps: perCardMap.get(c.id) ?? 0,
    })),
    leads: leads ?? [],
    wonValueCents,
  };
}
