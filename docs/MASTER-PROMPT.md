# TAPZILLA — The One-Shot Build Prompt

*Paste this entire document into a fresh long-running Claude Code session in the
Tapzilla repo. It is the complete specification. Build it phase by phase, in
order, verifying each phase before moving on.*

---

You are building **Tapzilla**: a self-serve platform where a local business
designs an NFC business card/magnet by talking to an AI, buys it, and a physical
product shows up in their mail — while their hosted "smart card page" goes live
instantly. Think **Lovable's build-by-conversation UX** crossed with **Etsy's
"it just arrives" fulfillment**, for a physical+digital product.

This platform is the commercial version of a system proven in production at
Sasquatch Carpet Cleaning (`sightings.sasquatchcarpet.com/tap` — reference source
at `~/Desktop/Sasquatch Carpet Cleaning/Sasquatch Sightings/`, key files:
`src/app/tap/page.tsx`, `src/components/nfc/NfcBookingWidget.tsx`, tap-tracking
API pattern in `src/app/api/tap/`). Read those files before building Phase 2.

## Non-negotiable product principles

1. **The AI edits a document, not code.** The builder AI manipulates a strictly
   validated JSON page-config schema via tool calls. The renderer turns config
   into UI. It must be impossible for the AI to produce a broken page. This is
   what makes a Lovable-style experience reliable for non-technical users.
2. **Two doors, one document.** An AI chat path AND a plain template/form path
   edit the same config. People who fear AI get dropdowns, toggles, drag-to-
   reorder blocks, and a live preview. People who like AI get conversation.
   Switching paths mid-build must be seamless.
3. **We own the URL.** Cards are encoded with `tapzilla.com/t/{cardCode}` —
   a redirect/render layer we control. Pages are editable forever without
   reprinting. Manufacturers only ever receive artwork + a URL list.
4. **Digital value before physical arrives.** The page goes live at checkout.
   The card arrives days later as the second "wow."
5. **Fulfillment is an interface, not a vendor.** All manufacturing goes through
   a `FulfillmentProvider` abstraction (see `docs/FULFILLMENT-RESEARCH.md`).
   Phase A ships with `ManualProvider` (admin queue + print-ready PDF export).
6. **People are busy and non-technical.** Every screen: one obvious next action,
   real finished examples to copy, live phone-frame preview always visible.
   Reading is optional; the demo card is the pitch.

## Stack (keep, already wired)

Next.js 14 App Router + Tailwind + Supabase (Postgres/Auth/RLS/Storage) +
Stripe + Vercel (repo auto-deploys `main` → tapzilla.vercel.app). Add:
Anthropic API (`claude-sonnet-5`) for the builder agent. Brand: keep
`public/Tapzilla.svg` robo-zilla logo + dark circuit aesthetic. Retire ALL
"AI salesperson" copy and the OpenAI chat product (`/c/[code]`, `/api/chat`).

## Data model (replaces the old lead/conversation schema — write a migration)

- `businesses` — owner user id, name, slug, industry, contact fields, branding
  (logo URL, colors), google_review_url, booking_url.
- `card_pages` — business_id, slug, `config` JSONB (versioned block schema),
  status (draft/published), published_at.
- `page_blocks` live INSIDE `config`, not as rows. Block types v1:
  `hero_card` (physical card mockup image), `cta_booking` (link-out or embedded
  lead form, coupon code display), `action_row` (call / text w/ prefilled body /
  save-contact vCard / share), `review_cta`, `gallery`, `service_areas`,
  `hours`, `socials`, `custom_links`, `coupon`. Each block: `type`, `enabled`,
  `order`, type-specific validated props (zod schemas shared client/server).
- `cards` — physical units: card_code (short, unguessable), page_id, product
  type (card/magnet), label ("Front desk", "Truck #2"), status.
- `visitors` — per-business first-party visitor id (1-yr cookie; no
  cross-tenant joins).
- `taps` — sessions: visitor_id, card_code, page_id, ts, **medium** (nfc / qr
  / share / direct), device type/OS/browser, coarse geo (city/metro — raw IP
  dropped after resolution), duration, scroll depth.
- `tap_events` — typed event stream per tap: every button click, coupon
  reveal/copy, block views, form started/abandoned (events only, never
  unsubmitted content).
- `leads` — form submissions + call/SMS-sourced: contact fields, service,
  photo upload, TCPA consent, pipeline status (new/contacted/won/lost),
  value_cents, enrichment JSONB, score.
- `tracking_numbers`, `calls`, `sms_messages` — Twilio call/text capture
  (Zilla): per-card attribution, missed-call text-back, forwarded SMS.
- `enrichment_lookups`, `benchmarks` — enrichment audit + anonymized
  cross-tenant industry aggregates.
  Full taxonomy, tier gating, and compliance rules: `docs/ANALYTICS-SPEC.md`
  — read it before building Phases 1 and 5; it is binding.
- `card_designs` — page_id, template_id, front/back layer config JSONB,
  rendered artwork asset URLs.
- `orders`, `order_items`, `fulfillment_events` — Stripe payment ref, provider,
  provider_order_id, status timeline (paid → artwork_ready → sent_to_vendor →
  shipped w/ tracking → delivered).
- `plans` — admin-editable tier config: name, Stripe price ids (monthly/annual),
  limits (max_pages, max_cards), feature flags (lead_form, per_card_analytics,
  badge_removed, ai_redesign, webhooks, hardware_discount_pct, priority_fulfillment).
- `products` — admin-editable hardware SKUs and prices.
- `subscriptions` — Stripe subscription per business, FK to `plans`.
- RLS: business owners see only their rows; platform admin role sees all.

## The Builder (the product's heart — build it properly)

Route: `/build`. Layout: left panel = chat + form controls (tabbed), right
panel = sticky live preview toggling between **phone-frame page preview** and
**physical card mockup** (front/back).

- **Onboarding moment:** "Paste your website or Google Business link — or just
  tell me about your business." If URL given, scrape name/logo/colors/services/
  phone/reviews server-side and prefill everything → instant draft in <30s.
  (The magic moment. If scraping fails, degrade silently to questions.)
- **Agent design:** Anthropic tool-use loop with tools:
  `get_config`, `apply_page_patch(patch)`, `apply_card_design_patch(patch)`,
  `set_business_info(fields)`, `suggest_templates(industry)`. Every patch is
  zod-validated server-side (also set `strict: true` on tool schemas); invalid
  patches bounce back to the model with the error. Stream assistant text; after
  each successful tool call push the new config to the preview over the same
  stream. System prompt: interview → draft fast → then refine ("Here's a first
  version — what should we change?"). Never ask more than one question at a
  time. Plain language, zero jargon.
- **Model & cost policy (binding):** builder model comes from env
  `BUILDER_MODEL`, default **`claude-sonnet-5`** ($3/$15 per MTok; intro $2/$10
  through 2026-08-31) with `output_config: {effort: "low"}` — this is
  slot-filling and interviewing over a validated schema, not deep reasoning;
  the templates/blocks ARE the intelligence. Use **`claude-haiku-4-5`**
  ($1/$5) for the website-scrape → business-fields extraction step. Prompt
  caching is mandatory: frozen system prompt + deterministic tool list first,
  `cache_control` breakpoint after them, all per-session content after the
  breakpoint (cache reads ≈0.1× input price). Guardrails in code: max ~30
  agent turns per build session, per-user daily session cap, token ceiling per
  session, all admin-configurable. Expected cost ≈ $0.05–0.20 per complete
  build session — log per-session usage to an `ai_usage` column so real costs
  are visible in admin.
- **Form path:** same config edited by direct controls — template picker
  (industry-tagged, seeded with a Sasquatch-style flagship example), block
  list with toggle/drag-reorder, per-block prop forms, theme picker.
- **Anonymous-first:** build without an account (config in localStorage +
  anonymous draft row); require signup only at save/checkout.
## Card artwork system (the physical design surface — three doors, one output)

Physical print has constraints the page doesn't: 3.375"×2.125" + 0.125" bleed,
300 DPI, safe zones, and an **NFC chip clearance zone** that artwork elements
must respect visually. Every door below outputs the same thing: a validated
`card_designs` row + print-ready front/back PDFs in storage.
`card_designs.source` = `template | upload | editor`.

- **Door 1 — Smart templates (default, v1, what 80% use):** deterministic
  React/SVG card templates with editable *slots* (logo upload, brand colors,
  curated font pairs, name/tagline/phone/coupon text, "tap me" mark + QR
  fallback). Print-safe by construction — slots physically cannot enter bleed
  or chip zones. The AI builder fills slots from scraped business info; the
  form path edits the same slots. Live physical mockup preview (front/back
  flip) next to the phone preview.
- **Door 2 — Upload your own (v1):** many businesses already have a designer.
  Accept PDF/PNG ≥300 DPI. Automated preflight: dimensions/DPI/bleed check,
  then an approval screen overlaying trim line + safe zone + chip zone on
  their file ("anything outside the green line may be cut off"). Also offer
  downloadable Canva + Figma template files with guides baked in — this serves
  Canva-loving customers with zero integration work: design there, upload here.
- **Door 3 — Embedded freeform editor (Pro/Zilla, post-v1):** white-label
  canvas editor via **Polotno SDK** (supports CMYK/bleed PDF export) embedded
  in the builder, pre-loaded with our card frame, guides, and chip-zone
  overlay, template as starting point. Requires a commercial license — build
  the `source: editor` seam now, integrate the SDK after launch.
  (Canva Connect API autofill/export exists but requires a Canva Enterprise
  org — revisit as a v2 premium-template pipeline, never as the foundation.)

## Card pages engine (port + generalize the Sasquatch /tap page)

Route `/t/[cardCode]`: resolve card → page → render blocks from config. Track
tap on load (API route, no client jank), track every button click attributed to
the tap and card_code. vCard served from an API route with
`Content-Disposition: inline` (phones open "Add Contact" — copy the Sasquatch
trick). Prefilled SMS body identifies the business. Native share w/ clipboard
fallback. OG tags per page. Fast on cheap Android phones: server-render, no
heavy JS, images optimized. Also route `/p/[slug]` for the page's shareable
non-card URL.

## Checkout, fulfillment, dashboards

- **Pricing (spec: `docs/PRICING-STRATEGY.md` — read it, it is binding):**
  three tiers — Starter $9/mo (1 page, 2 cards, core buttons, total-taps
  analytics, "Powered by Tapzilla" badge), Pro $29/mo ⭐ (10 cards, lead form +
  instant alerts, per-card/per-button analytics + CSV, badge removed, AI
  redesigns, 10% hardware discount), **Zilla $99/mo** (5 pages, unlimited
  cards, **call & text capture**: tracking number, per-card call attribution,
  missed-call instant text-back, call log — anchor: "replaces a $45+/mo call
  tracker alone"; lead enrichment quota, journey timelines, webhooks/Zapier,
  20% hardware discount + free replacements, priority fulfillment). Annual =
  2 months free. All limits/flags read from the `plans` table at runtime — no
  hardcoded entitlements anywhere.
  **Upgrade-trigger UX is a feature, build it deliberately:** card mint blocked
  at cap → upgrade modal; per-card analytics blurred (not hidden) on Starter
  with unlock CTA — data is always collected, only the view is gated; lead-form
  block visible-but-locked in the Starter builder; footer badge links to
  Tapzilla. Downgrades degrade features but NEVER kill a page or card URL.
- **Checkout (Square, not Stripe — the founder's existing processor):** our
  own checkout page using Square Web Payments SDK for card entry, then two
  server calls: CreatePayment for hardware SKUs from `products` (tier discount
  applied) and CreateSubscription (card on file) for the chosen plan — Square
  can't bundle one-time + recurring in one hosted checkout, so we own the page.
  Catalog subscription plans mirror the `plans` table. Sandbox env first
  (`SQUARE_ENVIRONMENT`), production + a dedicated "Tapzilla" Location at
  launch to keep revenue separate from the founder's other business. Webhook
  (signature-verified): on payment → publish page, mint `cards` rows + codes,
  render artwork PDFs to storage, create order in `pending_fulfillment`.
- **Fulfillment pipeline:** `FulfillmentProvider` interface
  (`createOrder/getStatus/webhook`). Ship `ManualProvider`: admin queue at
  `/admin/orders` showing artwork download + URL list + address, one-click
  status advance, tracking-number field → customer email at each stage
  (Resend). Stub `TapTagShopifyProvider` behind the same interface.
- **Customer dashboard `/dashboard` (spec: `docs/ANALYTICS-SPEC.md` — the
  dashboard is the retention product):** ROI header first ("Your cards drove
  $X this month" from lead pipeline values), funnel, per-card table, per-button
  breakdown, medium split (NFC/QR/share), geo map, hour/day heatmap, new vs
  returning, lead inbox with pipeline + job values, call log (Zilla), journey
  timelines (Zilla), benchmarks ("top 10% of carpet cleaners"), CSV export
  (Pro+), webhooks (Zilla), weekly summary email (Pro+). Starter sees the hero
  tap count + the rest blurred-but-real with unlock CTA. "Edit my page,"
  order status + tracking, reorder, Stripe portal.
- **Admin `/admin`:** orders pipeline, businesses, revenue, platform tap stats.

## Marketing site (last, thin)

Rewrite around "The business card that books jobs." Dark circuit aesthetic +
robo-zilla logo stay. Homepage hero = an actual live interactive demo card page
in a phone frame (the Sasquatch-style example), then how-it-works (design it →
we ship it → track every tap), pricing, and a single CTA everywhere: "Build
yours in 2 minutes" → `/build`. Kill: per-lead pricing page, AI-salesperson
copy, chat demo, channels/industries pages (redirect to home).

## Build order — each phase must run before the next starts

1. **Schema migration + card pages engine** (`/t/`, tracking, vCard, share).
   Verify: seed a demo business, tap flow works on a phone-sized viewport,
   taps/clicks land in DB.
2. **Builder — form path + live preview + templates + publish.**
   Verify: create page start-to-finish with mouse only, no AI.
3. **Builder — AI chat path** (tool-use agent + URL-scrape prefill + streaming
   preview updates). Verify: "I own a plumbing company in Denver called…" →
   complete draft page in one conversation.
4. **Checkout + orders + ManualProvider + emails + artwork Door 2** (upload +
   preflight + Canva/Figma guide files). Verify: Stripe test-mode purchase →
   page live, cards minted, artwork PDF (template-rendered AND uploaded)
   downloadable in admin, status advance sends email.
5. **Dashboards** (customer analytics per ANALYTICS-SPEC tier design, admin
   pipeline + platform cohorts). 5b. **Call & text capture** (Twilio: tracking
   numbers, forwarding, call log, missed-call text-back, SMS-to-lead; needs
   `TWILIO_*` env keys). Recording/transcription/AI summaries and enrichment
   adapters ship behind feature flags, OFF until vendor accounts + consent
   config exist.
6. **Marketing site rewrite** + demo card.
7. **Card artwork template polish + physical mockup preview** (Door 3 /
   Polotno embed stays post-v1 — only the `source: editor` seam ships now).

Environment realities: `.env.local` has Supabase + Stripe keys from v1 — verify
against the live Supabase project before migrating; add `ANTHROPIC_API_KEY` and
`RESEND_API_KEY` placeholders to `.env.local.example` and tell the founder what
to fill. Commit at every phase boundary with working builds only. Deploy is
automatic on push to `main` — use preview branches until Phase 4 is verified.

## Explicitly out of scope for v1

SMS/AI agents of any kind. Vendor partner placards (product #2, later — but keep
`cards.product_type` extensible). Custom domains and team seats (marketed as
"coming to Zilla" on the pricing page, not sold). Freehand AI image generation
on card fronts. Direct vendor APIs (Phase B/C of fulfillment doc — requires
human phone calls first).

---

## REVISION 2026-07-13 — product-model corrections (binding, supersede above)

1. **Cards/magnets = ONE URL per business.** Publish mints exactly one primary
   tap code; every physical unit (any quantity — founder prefers magnets,
   hotel-key format) prints it. No per-unit tracking for cards.
2. **Vendor placards are product #2 and are LIVE** — per-location tracked codes
   (`cards.product_type='placard'`), managed in the dashboard Locations
   section, capped by `plans.max_locations` (Pro 3 / Zilla 15). Placard taps
   show a "Found at: {location}" badge (the proven Sasquatch pattern).
3. **No phone integration, ever.** Phase 5b is cancelled. Booking links out
   (Jobber/Housecall Pro/website) are the conversion path.
4. Hardware = separate always-available store with volume ladder; 1,000+ units
   becomes a quote request (bulk fulfillment channel differs). Subscription
   required to order hardware.
