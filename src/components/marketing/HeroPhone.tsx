"use client";

import { useEffect, useState } from "react";
import { PageRenderer } from "@/components/card-page/PageRenderer";
import { HERO_DEMO } from "./demo-config";

/**
 * The hero centerpiece: a real card page (the actual product engine) in a
 * phone frame, with an NFC card that taps it on a loop and sends a ripple
 * through the screen. Fully interactive — visitors can scroll and click it.
 */
export function HeroPhone() {
  const [tapping, setTapping] = useState(false);

  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      setTapping(true);
      setTimeout(() => alive && setTapping(false), 1600);
    };
    loop();
    const id = setInterval(loop, 5200);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="relative mx-auto w-[300px] sm:w-[340px]">
      {/* Voltage aura behind the phone */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,217,213,0.35), rgba(255,127,10,0.12) 60%, transparent)",
        }}
      />

      {/* The NFC card — floats in, taps, floats out */}
      <div
        aria-hidden
        className={`absolute -left-24 top-16 z-20 hidden sm:block ${tapping ? "tz-card-tap" : "tz-card-idle"}`}
      >
        <div className="h-[104px] w-[168px] rotate-[-12deg] rounded-xl border border-white/20 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 p-3 shadow-2xl">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-display text-[11px] font-bold tracking-wide text-primary-400">
                RIDGELINE
              </span>
              {/* NFC waves */}
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-accent-400">
                <path
                  d="M8.5 15.5a5 5 0 0 1 0-7M5.7 18.3a9 9 0 0 1 0-12.6M11.3 12.7a1.2 1.2 0 1 1 1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <div className="mb-1 h-1.5 w-16 rounded bg-white/25" />
              <div className="h-1.5 w-10 rounded bg-white/15" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Tap phone to card
            </span>
          </div>
        </div>
      </div>

      {/* Tap ripple */}
      {tapping ? (
        <div aria-hidden className="absolute left-2 top-24 z-30">
          <span className="tz-ripple block h-4 w-4 rounded-full border-2 border-primary-400" />
        </div>
      ) : null}

      {/* Phone frame */}
      <div
        className={`relative z-10 rounded-[2.6rem] border-[6px] border-neutral-800 bg-black shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ${
          tapping ? "tz-phone-nudge" : ""
        }`}
      >
        <div className="overflow-hidden rounded-[2.2rem]">
          <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-neutral-900" />
          <div className="h-[560px] overflow-y-auto overscroll-contain sm:h-[600px]">
            <PageRenderer
              config={HERO_DEMO}
              meta={{ pageId: "", businessId: "", slug: "demo", shareUrl: "#" }}
              preview
            />
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-center text-xs text-white/45">
        ↑ A real Tapzilla page — go ahead, poke it
      </p>
    </div>
  );
}
