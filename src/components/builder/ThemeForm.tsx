"use client";

import type { PageConfig } from "@/lib/page-config/schema";
import { Field } from "./fields";

const SWATCHES = [
  { name: "Electric Teal", primary: "#00d9d5", accent: "#ff7f0a" },
  { name: "Ocean", primary: "#7c9aff", accent: "#22d3ee" },
  { name: "Forest", primary: "#4ade80", accent: "#f59e0b" },
  { name: "Sunset", primary: "#fb7185", accent: "#fbbf24" },
  { name: "Gold", primary: "#ffd166", accent: "#ef476f" },
  { name: "Violet", primary: "#a78bfa", accent: "#34d399" },
];

export function ThemeForm({
  config,
  onChange,
}: {
  config: PageConfig;
  onChange: (patch: Partial<PageConfig["theme"]>) => void;
}) {
  const t = config.theme;
  return (
    <div className="space-y-5">
      <Field label="Color scheme">
        <div className="grid grid-cols-3 gap-2">
          {SWATCHES.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => onChange({ primary: s.primary, accent: s.accent })}
              className={`rounded-lg border p-2 text-left ${
                t.primary === s.primary ? "border-white" : "border-white/15 hover:border-white/40"
              }`}
            >
              <span className="flex gap-1">
                <span className="h-4 w-4 rounded-full" style={{ background: s.primary }} />
                <span className="h-4 w-4 rounded-full" style={{ background: s.accent }} />
              </span>
              <span className="mt-1 block text-[11px] text-white/70">{s.name}</span>
            </button>
          ))}
        </div>
      </Field>
      <div className="flex gap-4">
        <Field label="Main color">
          <input
            type="color"
            value={t.primary}
            onChange={(e) => onChange({ primary: e.target.value })}
            className="h-9 w-16 cursor-pointer rounded border border-white/20 bg-transparent"
          />
        </Field>
        <Field label="Accent">
          <input
            type="color"
            value={t.accent}
            onChange={(e) => onChange({ accent: e.target.value })}
            className="h-9 w-16 cursor-pointer rounded border border-white/20 bg-transparent"
          />
        </Field>
      </div>
      <Field label="Background">
        <div className="flex gap-2">
          {(["gradient", "circuit", "solid"] as const).map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => onChange({ background: bg })}
              className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                t.background === bg
                  ? "border-white text-white"
                  : "border-white/15 text-white/60 hover:border-white/40"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
