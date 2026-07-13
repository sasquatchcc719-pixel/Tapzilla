import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/widgets";

export const dynamic = "force-dynamic";

/** Platform admin — founder's cockpit. Gated by platform_admins (RLS). */
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/admin");

  const { data: adminRow } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) redirect("/dashboard");

  const since30 = new Date(Date.now() - 30 * 86400_000).toISOString();

  const [{ data: businesses }, { count: taps30 }, { count: leads30 }, { data: aiUsage }] =
    await Promise.all([
      supabase
        .from("businesses")
        .select("id, name, slug, created_at, subscriptions(plan_id), card_pages(id, slug, status)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("taps").select("id", { count: "exact", head: true }).gte("created_at", since30),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since30),
      supabase
        .from("ai_usage")
        .select("model, input_tokens, output_tokens, cache_read_tokens")
        .gte("created_at", since30)
        .limit(5000),
    ]);

  const aiTotals = (aiUsage ?? []).reduce(
    (acc, r) => ({
      input: acc.input + r.input_tokens,
      output: acc.output + r.output_tokens,
      cache: acc.cache + r.cache_read_tokens,
      sessions: acc.sessions + 1,
    }),
    { input: 0, output: 0, cache: 0, sessions: 0 }
  );
  // Sonnet 5 intro pricing + cache reads at 0.1×
  const aiCost =
    (aiTotals.input * 2 + aiTotals.output * 10 + aiTotals.cache * 0.2) / 1_000_000;

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-2.5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/Tapzilla.svg" alt="Tapzilla" width={110} height={36} className="tz-logo-blend h-8 w-auto" />
          <span className="rounded bg-accent-500/20 px-2 py-0.5 text-xs font-bold uppercase text-accent-300">
            Admin
          </span>
        </Link>
        <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
          My dashboard
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-black text-white">Platform · last 30 days</h1>

        <div className="mb-8 grid gap-3 sm:grid-cols-4">
          <StatCard label="Businesses" value={String(businesses?.length ?? 0)} />
          <StatCard label="Taps" value={String(taps30 ?? 0)} />
          <StatCard label="Leads" value={String(leads30 ?? 0)} />
          <StatCard
            accent
            label="AI spend"
            value={`$${aiCost.toFixed(2)}`}
            sub={`${aiTotals.sessions} builder sessions`}
          />
        </div>

        <h2 className="mb-3 text-lg font-bold text-white">Businesses</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {(businesses ?? []).map((b) => {
                const page = (b.card_pages as { id: string; slug: string; status: string }[])?.[0];
                const plan = (b.subscriptions as { plan_id: string }[] | { plan_id: string } | null);
                const planId = Array.isArray(plan) ? plan[0]?.plan_id : plan?.plan_id;
                return (
                  <tr key={b.id} className="border-b border-white/5 text-white/80">
                    <td className="px-4 py-2.5 font-medium">{b.name}</td>
                    <td className="px-4 py-2.5 capitalize">{planId ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {page ? (
                        <Link href={`/p/${page.slug}`} className="text-primary-300 hover:underline">
                          /p/{page.slug}
                          {page.status !== "published" ? " (draft)" : ""}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-white/50">
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-white/35">
          Orders pipeline appears here once checkout ships (payments phase).
        </p>
      </div>
    </div>
  );
}
