import Link from "next/link";
import Image from "next/image";
import { HeroPhone } from "@/components/marketing/HeroPhone";
import { TapTicker } from "@/components/marketing/TapTicker";
import { Reveal } from "@/components/marketing/Reveal";
import { DashboardMock } from "@/components/marketing/DashboardMock";

const STEPS = [
  {
    n: "01",
    title: "Tell our AI about your business",
    body: "Chat for two minutes — or just paste your website. It builds your page while you watch, and you tweak anything with plain English.",
    icon: "💬",
  },
  {
    n: "02",
    title: "We print, encode & ship your cards",
    body: "NFC business cards with magnetic backs, wired to your page. Stick one on every fridge you clean, every panel you fix.",
    icon: "📦",
  },
  {
    n: "03",
    title: "Watch taps turn into jobs",
    body: "Every tap, call, and quote request is tracked to the exact card that earned it. Your dashboard shows the dollars.",
    icon: "📈",
  },
];

const TIERS = [
  {
    name: "Starter",
    price: "$9",
    blurb: "Your page, live and tap-tracked",
    features: [
      "1 smart card page",
      "2 active cards",
      "Call · text · save · share buttons",
      "Coupon code",
      "Tap counts",
    ],
    cta: "Start simple",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    blurb: "The workhorse — leads in writing",
    features: [
      "10 active cards — one per tech",
      "Quote request form + instant alerts",
      "Per-card & per-button analytics",
      "AI redesigns anytime",
      "Badge removed · 10% off hardware",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Zilla",
    price: "$99",
    blurb: "Every call, captured",
    features: [
      "Unlimited cards · 5 pages",
      "Call & text capture with per-card attribution",
      "Missed-call instant text-back",
      "Lead enrichment + webhooks",
      "20% off hardware · priority everything",
    ],
    cta: "Unleash Zilla",
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="container-custom grid items-center gap-14 pb-16 pt-10 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          <div className="max-w-xl">
            <Image
              src="/Tapzilla.svg"
              alt="Tapzilla"
              width={340}
              height={112}
              priority
              className="tz-logo-blend tz-hero-item mb-8 h-20 w-auto sm:h-24"
            />
            <h1
              className="tz-hero-item font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              The business card
              <br />
              that <span className="tz-electric">books jobs</span>
            </h1>
            <p
              className="tz-hero-item mt-6 text-lg text-white/70 sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              A customer taps their phone to your card — your page opens, they book,
              and you see exactly which card earned the money. No app. No website
              rebuild. No monkey business.
            </p>
            <div
              className="tz-hero-item mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "360ms" }}
            >
              <Link
                href="/build"
                className="tz-glow-btn rounded-2xl bg-primary-500 px-8 py-4 text-lg font-bold text-black transition-transform hover:scale-[1.03]"
              >
                Build yours in 2 minutes
              </Link>
              <Link
                href="/pricing"
                className="rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold text-white/85 transition-colors hover:border-primary-400 hover:text-white"
              >
                See pricing
              </Link>
            </div>
            <p
              className="tz-hero-item mt-5 text-sm text-white/40"
              style={{ animationDelay: "460ms" }}
            >
              Built by a carpet cleaner who got tired of business cards that do nothing.
            </p>
          </div>

          <div className="tz-hero-item" style={{ animationDelay: "300ms" }}>
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* ── Live tap feed ────────────────────────────────────────────── */}
      <TapTicker />

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="container-custom py-20 lg:py-28" id="how">
        <Reveal>
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-primary-400">
            How it works
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-4xl">
            From &ldquo;what&rsquo;s a smart card?&rdquo; to shipped in one sitting
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 130}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-primary-500/50">
                <span className="absolute -right-3 -top-6 font-display text-8xl font-bold text-white/[0.04] transition-colors group-hover:text-primary-500/10">
                  {s.n}
                </span>
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 font-display text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-white/60">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Analytics ────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent py-20 lg:py-28">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-400">
              Know what works
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Paper cards vanish.
              <br />
              These ones <span className="tz-electric">report back.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/65">
              Every tap is attributed to the physical card that earned it — the one on
              the fridge in Monument, the one your tech hands out, the magnet from the
              March mailer. Mark leads won, and your dashboard talks in dollars, not
              vibes.
            </p>
            <Link
              href="/build"
              className="mt-7 inline-block rounded-xl border border-accent-500/60 px-6 py-3 font-semibold text-accent-300 transition-colors hover:bg-accent-500/10"
            >
              Get your dashboard →
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <DashboardMock />
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section className="container-custom py-20 lg:py-28" id="pricing">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">
            Cards are one-time. <span className="tz-electric">Results are monthly.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-white/60">
            Hardware from $35 one-time. Plans keep your page live, your taps tracked,
            and your leads landing.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 130}>
              <div
                className={`relative h-full rounded-3xl border p-7 ${
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
                <h3 className="font-display text-xl font-bold text-white">{t.name}</h3>
                <p className="mt-1 text-sm text-white/50">{t.blurb}</p>
                <p className="mt-5 font-display text-5xl font-bold text-white">
                  {t.price}
                  <span className="text-base font-normal text-white/40">/mo</span>
                </p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-white/75">
                      <span className="text-primary-400">⚡</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/build"
                  className={`mt-8 block rounded-xl py-3 text-center font-bold transition-colors ${
                    t.featured
                      ? "bg-primary-500 text-black hover:bg-primary-400"
                      : "border border-white/20 text-white hover:border-white/50"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(0,217,213,0.25), transparent)",
          }}
        />
        <div className="container-custom relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Your next customer is holding their phone
              <span className="tz-electric"> right now.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              Two minutes with our AI and your page is live. Cards show up in the mail.
              Taps show up in your pocket.
            </p>
            <Link
              href="/build"
              className="tz-glow-btn mt-10 inline-block rounded-2xl bg-primary-500 px-10 py-5 text-xl font-bold text-black transition-transform hover:scale-[1.03]"
            >
              Build my smart card →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
