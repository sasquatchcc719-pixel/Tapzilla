import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadDashboard } from "@/lib/analytics";
import { BarSpark, Gated, SplitBar, StatCard } from "@/components/dashboard/widgets";
import { LeadInbox } from "@/components/dashboard/LeadInbox";

export const dynamic = "force-dynamic";

const MEDIUM_LABELS = { nfc: "Card tap", qr: "QR scan", share: "Shared link", direct: "Direct" };
const BUTTON_LABELS: Record<string, string> = {
  call: "📞 Call",
  text: "💬 Text",
  save_contact: "👤 Save contact",
  share: "🔗 Share",
  review: "⭐ Review",
  booking: "📅 Booking",
  lead_form_open: "📝 Form opened",
  social: "Social",
  custom_link: "Link",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  const data = await loadDashboard(supabase, user.id);

  if (!data) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg py-20 text-center">
          <h1 className="text-2xl font-black text-white">No page yet</h1>
          <p className="mt-2 text-white/60">Build your smart card page first — it takes about two minutes.</p>
          <Link
            href="/build"
            className="mt-6 inline-block rounded-xl bg-primary-500 px-6 py-3 font-bold text-black hover:bg-primary-400"
          >
            Build my page
          </Link>
        </div>
      </Shell>
    );
  }

  const pro = Boolean(data.features.per_card_analytics);
  const delta = data.tapsPrev30
    ? Math.round(((data.taps30 - data.tapsPrev30) / data.tapsPrev30) * 100)
    : null;

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ROI header — the first thing the eye lands on, always */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">{data.business.name}</h1>
            <p className="text-sm text-white/50">
              Last 30 days · <span className="capitalize">{data.planId}</span> plan
            </p>
          </div>
          <div className="flex gap-2">
            {data.page ? (
              <Link
                href={`/p/${data.page.slug}`}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                View my page
              </Link>
            ) : null}
            <Link
              href="/build"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-bold text-black hover:bg-primary-400"
            >
              Edit my page
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <StatCard
            accent
            label="Won business from your cards"
            value={`$${Math.round(data.wonValueCents / 100).toLocaleString()}`}
            sub="From leads you marked won — keep it updated, it's your ROI"
          />
          <StatCard
            label="Taps"
            value={String(data.taps30)}
            sub={delta === null ? "First 30 days" : `${delta >= 0 ? "+" : ""}${delta}% vs previous 30`}
          />
          <StatCard
            label="Leads"
            value={String(data.leads.length)}
            sub={`${data.leads.filter((l) => l.status === "new").length} new to follow up`}
          />
        </div>

        {/* Taps over time */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
            Taps — last 30 days
          </p>
          <BarSpark data={data.tapsByDay} />
        </div>

        {/* Pro analytics — always collected, view gated on Starter */}
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Gated locked={!pro} feature="Traffic breakdown">
            <div className="space-y-3">
              <SplitBar title="How people arrive" split={data.mediumSplit} labels={MEDIUM_LABELS} />
              <SplitBar title="Devices" split={data.deviceSplit} />
            </div>
          </Gated>
          <Gated locked={!pro} feature="Button analytics">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                What people tap
              </p>
              {data.buttonClicks.length ? (
                <div className="space-y-2">
                  {data.buttonClicks.map((b) => {
                    const max = data.buttonClicks[0].count;
                    return (
                      <div key={b.button} className="flex items-center gap-2 text-sm">
                        <span className="w-32 flex-shrink-0 text-white/70">
                          {BUTTON_LABELS[b.button] ?? b.button}
                        </span>
                        <div className="h-4 flex-1 overflow-hidden rounded bg-white/5">
                          <div
                            className="h-full rounded bg-accent-500/80"
                            style={{ width: `${(b.count / max) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-white/60">{b.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/40">No clicks yet</p>
              )}
            </div>
          </Gated>
        </div>

        {/* Per-card attribution */}
        <Gated locked={!pro} feature="Per-card tracking">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Your cards
            </p>
            {data.perCard.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-white/40">
                    <th className="pb-2">Card</th>
                    <th className="pb-2">Code</th>
                    <th className="pb-2 text-right">Taps (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perCard.map((c) => (
                    <tr key={c.cardId} className="border-t border-white/5 text-white/80">
                      <td className="py-2">{c.label}</td>
                      <td className="py-2 font-mono text-xs text-white/50">{c.code}</td>
                      <td className="py-2 text-right font-bold">{c.taps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-white/40">
                Your physical cards appear here once your order ships — each one tracked separately.
              </p>
            )}
          </div>
        </Gated>

        {/* Returning visitors + Zilla teaser */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Returning visitors"
            value={`${data.returningPct}%`}
            sub="People who came back to your page"
          />
          {!data.features.call_capture ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-4">
              <p className="text-sm font-bold text-white">
                📞 {data.buttonClicks.find((b) => b.button === "call")?.count ?? 0} call clicks — what
                happened next?
              </p>
              <p className="mt-1 text-xs text-white/60">
                Zilla tracks every call your cards generate: who called, from which card, and
                texts back anyone you miss.
              </p>
              <Link href="/pricing" className="mt-2 inline-block text-sm font-semibold text-primary-300 hover:underline">
                See Zilla →
              </Link>
            </div>
          ) : (
            <StatCard label="Call capture" value="Active" sub="Calls and missed-call text-back are being tracked" />
          )}
        </div>

        {/* Lead inbox */}
        <h2 className="mb-3 text-lg font-bold text-white">Leads</h2>
        <LeadInbox initial={data.leads} />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-2.5">
        <Link href="/" className="flex items-center">
          <Image src="/Tapzilla.svg" alt="Tapzilla" width={110} height={36} className="h-8 w-auto" />
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="text-sm text-white/60 hover:text-white">Sign out</button>
        </form>
      </header>
      {children}
    </div>
  );
}
