"use client";

import { useEffect, useRef, useState } from "react";
import { Field, TextInput } from "./fields";

type Candidate = { placeId: string; name: string; address: string };

function reviewLink(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Find a Google review link by business name instead of making the owner
 * hunt for the exact deep link. Searches Google Places; on selection we
 * build the writereview URL from the place_id. Degrades to manual entry
 * (with a Maps helper) when the search key isn't configured.
 */
export function ReviewLinkFinder({
  value,
  cityHint,
  onChange,
}: {
  value?: string;
  cityHint?: string;
  onChange: (url: string | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [manual, setManual] = useState(false);
  const [chosenName, setChosenName] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const withCity = cityHint && !q.toLowerCase().includes(cityHint.toLowerCase()) ? `${q} ${cityHint}` : q;
      const res = await fetch(`/api/place-search?q=${encodeURIComponent(withCity)}`).catch(() => null);
      setLoading(false);
      if (!res) return;
      const d = await res.json();
      setConfigured(d.configured !== false);
      setResults(d.results ?? []);
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, cityHint]);

  const pick = (c: Candidate) => {
    onChange(reviewLink(c.placeId));
    setChosenName(c.name);
    setResults([]);
    setQuery("");
  };

  // Already has a link (or user chose manual): show a compact confirmed/edit view
  if (manual) {
    return (
      <Field label="Google review link" hint="Paste the link you want customers sent to">
        <TextInput
          type="url"
          value={value ?? ""}
          placeholder="https://search.google.com/local/writereview?placeid=…"
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        <button
          type="button"
          onClick={() => setManual(false)}
          className="mt-1.5 text-xs text-primary-300 hover:underline"
        >
          ← Search by business name instead
        </button>
      </Field>
    );
  }

  if (value && !query) {
    return (
      <Field label="Google review link">
        <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2.5">
          <span className="text-green-400">✓</span>
          <span className="flex-1 truncate text-sm text-white/85">
            {chosenName ? `Review link set for ${chosenName}` : "Review link saved"}
          </span>
          <button
            type="button"
            onClick={() => {
              onChange(undefined);
              setChosenName(null);
            }}
            className="text-xs text-white/50 hover:text-white"
          >
            Change
          </button>
        </div>
      </Field>
    );
  }

  return (
    <Field
      label="Google review link"
      hint="Type your business name — we'll find the exact “leave a review” link for you"
    >
      <TextInput
        value={query}
        placeholder="e.g. Ridgeline Carpet Care"
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? <p className="mt-1.5 text-xs text-white/40">Searching Google…</p> : null}

      {results.length > 0 ? (
        <div className="mt-1.5 overflow-hidden rounded-lg border border-white/15 bg-neutral-900">
          {results.map((c) => (
            <button
              key={c.placeId}
              type="button"
              onClick={() => pick(c)}
              className="block w-full border-b border-white/5 px-3 py-2 text-left last:border-0 hover:bg-white/5"
            >
              <span className="block text-sm font-medium text-white">{c.name}</span>
              {c.address ? <span className="block text-xs text-white/45">{c.address}</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      {/* Keyless fallback: search not wired up yet */}
      {!configured && query.trim().length >= 3 && !loading ? (
        <div className="mt-1.5 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
          <p>Business search isn&apos;t turned on yet. In the meantime:</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-semibold text-primary-300 hover:underline"
          >
            Open your listing on Google Maps →
          </a>
          <button
            type="button"
            onClick={() => setManual(true)}
            className="mt-1 block text-primary-300 hover:underline"
          >
            …then paste your link here
          </button>
        </div>
      ) : null}

      {configured ? (
        <button
          type="button"
          onClick={() => setManual(true)}
          className="mt-1.5 text-xs text-white/40 hover:text-white/70"
        >
          Paste a link manually instead
        </button>
      ) : null}
    </Field>
  );
}
