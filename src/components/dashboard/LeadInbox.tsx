"use client";

import { useState } from "react";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: string;
  value_cents: number | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "won", "lost"] as const;
const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary-500/20 text-primary-300",
  contacted: "bg-blue-500/20 text-blue-300",
  won: "bg-green-500/20 text-green-300",
  lost: "bg-white/10 text-white/50",
};

/** Lead pipeline. Status + job value edits feed the ROI header — every "won"
 * with a dollar amount is the number that renews the subscription. */
export function LeadInbox({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const patch = async (id: string, fields: Partial<Pick<Lead, "status" | "value_cents">>) => {
    setBusy(id);
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...fields } : l)));
    await fetch("/api/leads/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    }).catch(() => {});
    setBusy(null);
  };

  if (!leads.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/50">
        No leads yet — they&apos;ll appear here the moment someone submits your quote form.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {leads.map((l) => (
        <div key={l.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-white">{l.name ?? "Unknown"}</span>
            {l.phone ? (
              <a href={`tel:${l.phone}`} className="text-sm text-primary-300 hover:underline">
                {l.phone}
              </a>
            ) : null}
            <span className="ml-auto text-xs text-white/40">
              {new Date(l.created_at).toLocaleDateString()}
            </span>
          </div>
          {l.service ? <p className="mt-1 text-sm text-white/70">Wants: {l.service}</p> : null}
          {l.message ? <p className="mt-1 text-sm text-white/60">&ldquo;{l.message}&rdquo;</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={busy === l.id}
                onClick={() => patch(l.id, { status: s })}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-opacity ${
                  l.status === s ? STATUS_STYLES[s] : "bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {s}
              </button>
            ))}
            {l.status === "won" ? (
              <span className="ml-2 flex items-center gap-1 text-xs text-white/60">
                Job value $
                <input
                  type="number"
                  min={0}
                  defaultValue={l.value_cents ? Math.round(l.value_cents / 100) : ""}
                  onBlur={(e) => {
                    const dollars = parseInt(e.target.value, 10);
                    if (!Number.isNaN(dollars)) patch(l.id, { value_cents: dollars * 100 });
                  }}
                  className="w-20 rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-white"
                />
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
