# Tapzilla Pricing Strategy — Three Tiers + Hardware

*Written 2026-07-13. Goal: maximize revenue per customer over their lifetime.
Mechanism: a three-tier ladder where Tier 1/2 are the obvious entry points and
the software's own growth mechanics push upgrades. Hardware is a separate
one-time revenue stream with tier-linked discounts that reinforce subscribing up.*

## The economics underneath (from FULFILLMENT-RESEARCH.md)

- Hardware COGS: ~$6–12 landed per card/magnet at launch scale (TapTag qty-1–25
  pricing + shipping; drops hard at GoToTags volume).
- Customer context: local service businesses already pay $100–300/mo for
  Jobber/Housecall Pro and more for marketing. $29/mo is a rounding error IF
  it demonstrably books jobs — which tap/click analytics prove to them.
- The recurring plan is the real product (hosting, tracking, editability);
  hardware is the acquisition event and the margin kicker.

## Why customers upgrade (dependencies built into the product)

The tier boundaries sit exactly on the product's natural growth axes:

1. **Active cards.** Success = more cards (new employee, second truck, counter
   stand, magnet batch for mailers). Card minting is hard-capped per tier; the
   "add card" button is always visible and opens the upgrade modal at the cap.
2. **Lead capture.** Tier 1 pages drive calls/texts (invisible ROI). Tier 2 adds
   the lead form + instant SMS/email alerts — the moment a customer wants leads
   *in writing*, they upgrade. The lead-form block appears in every builder,
   lockmarked on Starter.
3. **Attribution.** Tier 1 sees total taps only. The per-card / per-button
   analytics views render blurred with an unlock CTA on Starter — the data is
   collected from day one, so upgrading instantly reveals history they already
   own. (Collect everything always; gate the *view*, never the collection.)
4. **Branding.** "⚡ Powered by Tapzilla" footer badge on Tier 1 pages (also our
   viral loop — every tap markets us). Removal = Tier 2.
5. **Scale features.** Multiple pages (campaigns/locations), webhooks/Zapier to
   their CRM, hardware discounts, priority fulfillment = Tier 3, which is
   effectively "you're running an operation now."
6. **The phone call.** Most home-service conversions are calls, and Starter/Pro
   dashboards show call *clicks* but not call outcomes. Zilla closes the loop:
   tracking numbers, per-card call attribution, missed-call instant text-back,
   enriched caller profiles. The dashboard shows Pro users a "📞 12 calls
   clicked — what happened next?" teaser pointing at Zilla.

## The tiers

| | **Starter — $9/mo** | **Pro — $29/mo** ⭐ most popular | **Zilla — $99/mo** |
|---|---|---|---|
| Card pages | 1 | 1 | 5 (campaigns/locations) |
| Active cards | 2 | 10 | Unlimited |
| Action buttons, coupon, vCard, share | ✅ | ✅ | ✅ |
| AI builder (initial design) | ✅ | ✅ | ✅ |
| AI redesigns anytime | — | ✅ | ✅ |
| Analytics | Total taps (30 days) | Per-card, per-button, full history, CSV | Pro + journeys, page comparison |
| Lead capture form + instant alerts | — | ✅ | ✅ |
| **Call & text capture** (tracking number, per-card call attribution, missed-call text-back, call log) | — | — | ✅ |
| Lead enrichment (owner/property data, monthly quota) | — | — | ✅ |
| "Powered by Tapzilla" badge | On page | Removed | Removed |
| Webhooks / Zapier | — | — | ✅ |
| Hardware discount | — | 10% | 20% + free replacements |
| Fulfillment | Standard | Standard | Priority queue |
| Support | Email | Priority email | Priority + onboarding call |

Annual billing = 2 months free (Starter $90, Pro $290, Zilla $990). Anchor the
pricing page around Pro; Zilla is priced against CallRail ($45+/mo for call
tracking alone) — the pitch line is "your card, your leads, and every phone
call it generates — for less than a call tracker by itself." Full analytics
architecture: `ANALYTICS-SPEC.md`.

**Hardware (one-time, tier discounts apply):** single card+magnet ~$35;
3-pack ~$79; 10-pack ~$199. Exact SKUs/prices live in an admin-editable
`products` table, not code. Replacements full price on Starter/Pro (free on
Zilla) — cards are durable; this is a trust signal, not a cost center.

**Coming to Zilla (build later, don't sell yet):** custom domains, team seats,
partner placard program (product #2) — Zilla holders get it first, which gives
Tier 3 a future-proofing story from day one.

## Guardrails

- Tier 1 must stay genuinely good (page + core buttons + coupon + total taps).
  A resentful $9 customer churns and reviews badly; a happy one hires an
  employee and needs card #3. Extraction comes from growth pressure, not
  crippleware.
- Never gate data collection, page editability, or the card working. The chip
  must never brick on downgrade — a downgraded page falls back to Starter
  features, never to a dead URL. (Dead cards = chargebacks + horror reviews.)
- All limits live in a `plans` config table so we can tune numbers without
  deploys, and grandfather early customers by pointing their row at legacy plans.
