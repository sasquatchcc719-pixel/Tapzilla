"use client";

/** Infinite marquee of tap events — the "every tap is tracked" proof strip. */

const EVENTS = [
  { icon: "⚡", text: "Card tapped · Monument, CO" },
  { icon: "📞", text: "Call button pressed · Ridgeline Carpet Care" },
  { icon: "📝", text: "New lead: “2 rooms + pet stains”" },
  { icon: "⚡", text: "QR scanned · Castle Rock, CO" },
  { icon: "⭐", text: "Review link opened" },
  { icon: "🎟️", text: "Coupon TAP20 copied" },
  { icon: "👤", text: "Contact saved to iPhone" },
  { icon: "📅", text: "Estimate requested · $340 job won" },
  { icon: "⚡", text: "Card tapped · Colorado Springs, CO" },
  { icon: "🔗", text: "Page shared by a happy customer" },
];

export function TapTicker() {
  const row = [...EVENTS, ...EVENTS]; // duplicated for a seamless loop
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/60 py-3.5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent"
      />
      <div className="tz-marquee flex w-max gap-10">
        {row.map((e, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm text-white/60">
            <span>{e.icon}</span>
            {e.text}
            <span className="ml-6 text-white/15">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
