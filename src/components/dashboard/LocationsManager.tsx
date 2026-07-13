"use client";

import { useState } from "react";

type Location = { id: string; label: string; code: string; status: string; taps: number };

/** Vendor placard locations — mint a tracked code per host business.
 * The nail-salon-bathroom money printer, productized. */
export function LocationsManager({
  initial,
  maxLocations,
  appUrl,
}: {
  initial: Location[];
  maxLocations: number;
  appUrl: string;
}) {
  const [locations, setLocations] = useState(initial);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const active = locations.filter((l) => l.status === "active").length;

  const add = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Network error — try again.");
    const d = await res.json();
    if (!res.ok) {
      setError(
        d.error === "location_limit"
          ? `You're using all ${maxLocations} locations on your plan.`
          : d.error ?? "Couldn't add that location."
      );
      return;
    }
    setLocations((ls) => [...ls, { ...d.location, taps: 0 }]);
    setName("");
  };

  const toggle = async (loc: Location) => {
    const status = loc.status === "active" ? "disabled" : "active";
    setLocations((ls) => ls.map((l) => (l.id === loc.id ? { ...l, status } : l)));
    await fetch("/api/locations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: loc.id, status }),
    }).catch(() => {});
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${appUrl}/t/${code}`);
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          Placard locations
        </p>
        <span className="text-xs text-white/40">
          {active}/{maxLocations} used
        </span>
      </div>

      {locations.length ? (
        <div className="mb-4 space-y-2">
          {locations.map((l) => (
            <div
              key={l.id}
              className={`flex flex-wrap items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 ${
                l.status === "disabled" ? "opacity-50" : ""
              }`}
            >
              <span className="font-medium text-white">{l.label}</span>
              <span className="text-xs text-white/40">· {l.taps} taps (30d)</span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => copy(l.code)}
                  className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/70 hover:border-white/40"
                >
                  {copied === l.code ? "✓ Copied" : "Copy tap URL"}
                </button>
                <button
                  onClick={() => toggle(l)}
                  className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/50 hover:border-white/40"
                >
                  {l.status === "active" ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-white/50">
          A placard is your ad mounted inside another business — barbershop counter,
          nail salon, laundromat. Each location gets its own tracked tap URL, so you
          know exactly which spot earns.
        </p>
      )}

      {active < maxLocations ? (
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder={`Location name — "Joe's Barbershop"`}
            className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
          />
          <button
            onClick={add}
            disabled={busy || !name.trim()}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            Add
          </button>
        </div>
      ) : (
        <p className="text-xs text-white/45">
          All {maxLocations} locations in use —{" "}
          <a href="/pricing" className="text-primary-300 hover:underline">
            upgrade for more
          </a>
          .
        </p>
      )}
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
