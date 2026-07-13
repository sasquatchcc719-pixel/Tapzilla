/** Server-renderable dashboard widgets (no client JS needed). */

export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "border-primary-500/40 bg-primary-500/10" : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{label}</p>
      <p className={`mt-1 text-3xl font-black ${accent ? "text-primary-300" : "text-white"}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-white/50">{sub}</p> : null}
    </div>
  );
}

export function BarSpark({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-24 items-end gap-[3px]">
      {data.map((d) => (
        <div
          key={d.day}
          title={`${d.day}: ${d.count} taps`}
          className="flex-1 rounded-t bg-primary-500/70"
          style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function SplitBar({
  title,
  split,
  labels,
}: {
  title: string;
  split: Record<string, number>;
  labels?: Record<string, string>;
}) {
  const total = Object.values(split).reduce((a, b) => a + b, 0);
  const entries = Object.entries(split).sort((a, b) => b[1] - a[1]);
  const colors = ["bg-primary-500", "bg-accent-500", "bg-blue-500", "bg-purple-500"];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{title}</p>
      {total === 0 ? (
        <p className="text-sm text-white/40">No data yet</p>
      ) : (
        <>
          <div className="flex h-3 overflow-hidden rounded-full">
            {entries.map(([k, v], i) => (
              <div key={k} className={colors[i % colors.length]} style={{ width: `${(v / total) * 100}%` }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {entries.map(([k, v], i) => (
              <span key={k} className="flex items-center gap-1.5 text-xs text-white/70">
                <span className={`h-2 w-2 rounded-full ${colors[i % colors.length]}`} />
                {labels?.[k] ?? k}: {v} ({Math.round((v / total) * 100)}%)
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Wraps gated content: rendered blurred with an upgrade CTA when locked.
 * Data is always real — only the view is gated (per ANALYTICS-SPEC). */
export function Gated({
  locked,
  feature,
  children,
}: {
  locked: boolean;
  feature: string;
  children: React.ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-[6px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 p-4 text-center">
        <p className="text-sm font-bold text-white">{feature} is on Pro</p>
        <p className="max-w-xs text-xs text-white/70">
          This data is being recorded right now — upgrade and see your full history instantly.
        </p>
        <a
          href="/pricing"
          className="rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-bold text-black hover:bg-primary-400"
        >
          Unlock
        </a>
      </div>
    </div>
  );
}
