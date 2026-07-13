import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Pricing — Tapzilla",
  description:
    "Smart NFC cards from $35 one-time. Plans from $9/mo keep your page live, taps tracked, and leads landing.",
};

const TIERS = [
  {
    name: "Starter",
    price: 9,
    annual: 90,
    blurb: "Your page, live and tap-tracked.",
    features: [
      "1 smart card page — one URL on every card",
      "Order any quantity of cards & magnets",
      "Call · text · save-contact · share buttons",
      "Coupon code on your page",
      "Tap counts, last 30 days",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: 29,
    annual: 290,
    blurb: "The workhorse. Leads in writing, proof in numbers.",
    features: [
      "Quote request form + instant lead alerts",
      "Full analytics — every button, full history",
      "CSV export",
      "AI redesigns anytime",
      "3 placard locations in partner businesses",
      "“Powered by Tapzilla” badge removed",
      "10% off all hardware",
    ],
    featured: true,
  },
  {
    name: "Zilla",
    price: 99,
    annual: 990,
    blurb: "The placard empire. Your ad in every good spot in town.",
    features: [
      "15 placard locations — add 5 more for $25/mo",
      "Per-location attribution: know which spot earns",
      "Webhooks / Zapier to Jobber, Housecall Pro & your CRM",
      "20% off hardware + free replacements",
      "Priority fulfillment & support",
    ],
    featured: false,
  },
];

const HARDWARE = [
  { name: "Smart Card + Magnet", price: "$35", note: "One card, magnetic back, wired to your page" },
  { name: "3-Pack", price: "$79", note: "Save $26 — cover your crew" },
  { name: "10-Pack", price: "$199", note: "Save $151 — every truck, every counter" },
];

const FAQS = [
  {
    q: "What's a placard location?",
    a: "A mounted ad with your tap chip + QR inside a partner business — the barbershop counter, the nail salon wall. Each location gets its own tracked link, so your dashboard shows exactly which spot sends you jobs. One good location can pay for your whole plan.",
  },
  {
    q: "Do I need a new card if I change my page?",
    a: "Never. The chip points to your page, and your page is editable forever. Change your prices, coupon, photos — the card in someone's kitchen drawer just gets better.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your page falls back to a basic version — we never brick a card you handed out. Upgrade again anytime and your full history is still there.",
  },
  {
    q: "Do customers need an app?",
    a: "No. Tapping works natively on iPhone and Android. Older phones can scan the printed QR code on the card instead — both are tracked.",
  },
  {
    q: "How fast do cards arrive?",
    a: "Standard orders ship within days, not weeks. Zilla orders jump the queue.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-custom py-16 lg:py-24">
      <Reveal>
        <h1 className="text-center font-display text-4xl font-bold text-white sm:text-5xl">
          Simple math: <span className="tz-electric">cards + plan = jobs</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg text-white/60">
          Hardware is one-time. Your plan keeps the page live, the taps tracked, and
          the leads landing. Annual billing gets two months free.
        </p>
      </Reveal>

      {/* Plans */}
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <div
              className={`relative h-full rounded-3xl border p-8 ${
                t.featured
                  ? "tz-featured-tier border-primary-500/70 bg-primary-500/[0.07]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {t.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
                  Most popular
                </span>
              ) : null}
              <h2 className="font-display text-2xl font-bold text-white">{t.name}</h2>
              <p className="mt-1 text-sm text-white/55">{t.blurb}</p>
              <p className="mt-6 font-display text-5xl font-bold text-white">
                ${t.price}
                <span className="text-base font-normal text-white/40">/mo</span>
              </p>
              <p className="mt-1 text-xs text-white/40">or ${t.annual}/yr — 2 months free</p>
              <ul className="mt-7 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-white/75">
                    <span className="mt-0.5 text-primary-400">⚡</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/build"
                className={`mt-8 block rounded-xl py-3.5 text-center font-bold transition-colors ${
                  t.featured
                    ? "bg-primary-500 text-black hover:bg-primary-400"
                    : "border border-white/20 text-white hover:border-white/50"
                }`}
              >
                Build your page first — pick a plan at checkout
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Hardware */}
      <Reveal className="mt-24">
        <h2 className="text-center font-display text-3xl font-bold text-white">
          The hardware
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-white/60">
          NFC business cards with magnetic backs. Tap-to-open on any modern phone, QR
          fallback printed on. Pro saves 10%, Zilla saves 20%.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {HARDWARE.map((h) => (
            <div key={h.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-display text-3xl font-bold text-white">{h.price}</p>
              <p className="mt-1 font-semibold text-white/85">{h.name}</p>
              <p className="mt-2 text-xs text-white/50">{h.note}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal className="mt-24">
        <h2 className="text-center font-display text-3xl font-bold text-white">
          Fair questions
        </h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-primary-500/40"
            >
              <summary className="cursor-pointer list-none font-semibold text-white marker:content-none">
                <span className="mr-2 text-primary-400 transition-transform group-open:rotate-90 inline-block">
                  ›
                </span>
                {f.q}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-white/65">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="mt-24 text-center">
        <Link
          href="/build"
          className="tz-glow-btn inline-block rounded-2xl bg-primary-500 px-10 py-5 text-xl font-bold text-black transition-transform hover:scale-[1.03]"
        >
          Build my smart card →
        </Link>
        <p className="mt-4 text-sm text-white/40">
          Free to build. You only pay when you order cards.
        </p>
      </Reveal>
    </div>
  );
}
