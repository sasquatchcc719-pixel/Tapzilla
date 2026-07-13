"use client";

import { useEffect, useRef, useState } from "react";

/** Animated dashboard vignette — bars grow in when scrolled into view. */

const BARS = [4, 7, 5, 9, 12, 8, 14, 11, 17, 13, 19, 22, 16, 24];
const BUTTONS = [
  { label: "📞 Call", pct: 92 },
  { label: "📝 Quote form", pct: 71 },
  { label: "🎟️ Coupon copied", pct: 55 },
  { label: "⭐ Review", pct: 38 },
];

export function DashboardMock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/80 to-black p-5 shadow-2xl sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Won business from your cards
          </p>
          <p className="font-display text-4xl font-bold text-primary-400">
            {on ? <Counter to={4380} prefix="$" /> : "$0"}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Taps</p>
            <p className="text-2xl font-bold text-white">{on ? <Counter to={181} /> : "0"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Leads</p>
            <p className="text-2xl font-bold text-white">{on ? <Counter to={23} /> : "0"}</p>
          </div>
        </div>
      </div>

      {/* Tap bars */}
      <div className="mb-6 flex h-24 items-end gap-1.5">
        {BARS.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-primary-500/80 transition-all duration-700 ease-out"
            style={{
              height: on ? `${(v / 24) * 100}%` : "4%",
              transitionDelay: `${i * 45}ms`,
            }}
          />
        ))}
      </div>

      {/* Button breakdown */}
      <div className="space-y-2.5">
        {BUTTONS.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3 text-sm">
            <span className="w-36 flex-shrink-0 text-white/70">{b.label}</span>
            <div className="h-3.5 flex-1 overflow-hidden rounded bg-white/5">
              <div
                className="h-full rounded bg-gradient-to-r from-accent-600 to-accent-400 transition-all duration-1000 ease-out"
                style={{ width: on ? `${b.pct}%` : "0%", transitionDelay: `${400 + i * 120}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Counter({ to, prefix = "" }: { to: number; prefix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const dur = 1400;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      {prefix}
      {n.toLocaleString()}
    </>
  );
}
