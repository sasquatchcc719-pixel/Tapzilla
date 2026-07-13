# Analytics & Lead Intelligence Spec — "The Dashboard IS the Product"

*Written 2026-07-13. Analytics is why customers keep paying. The dashboard must
answer one question on sight: "what did my cards earn me this month?" Everything
below serves that. Collect everything from day one for every tier; gate VIEWS by
tier, never collection — upgrades instantly reveal history the customer already
owns.*

## Competitive frame (researched)

- Popl/Linq/Uniqode track: views, unique viewers, contact saves, view time/date,
  location, device, click-level per-section analytics, GPS, CRM sync. Table stakes.
- CallRail ($45+/mo, the home-services standard) proves the real money is in
  **call tracking**: tracking numbers, source attribution, recording,
  transcription, AI categorization. No digital-card platform owns this. We will.
- BatchData/ATTOM/Trestle prove a phone number can become a full profile:
  owner name, address, homeowner status, sq ft, year built, home value.
  For home services, that's a quote before the callback.

## Collection layers (event taxonomy)

**L1 — Visit signals (every visitor, automatic):**
card_code + page, timestamp, **medium** (NFC tap vs QR scan vs shared link vs
direct — encoded in URL: chip = `/t/{code}`, printed QR = `?m=qr`, share =
`?m=sh`), new vs returning (first-party visitor ID, 1-yr cookie), device
type/OS/browser, coarse geo (IP→city/metro server-side, then **drop the raw
IP**), session duration, scroll depth, blocks viewed (IntersectionObserver),
time-of-day/day-of-week.

**L2 — Engagement events (per session):**
every button: call, text, save-contact, share, review click, directions,
social links, booking click, gallery interactions, **coupon reveal/copy**
(strong intent), video plays, lead-form started / abandoned-at-field
(event only — never store unsubmitted field *content*).

**L3 — Lead capture (Pro+):**
configurable form: name, phone, email, address, service type, urgency,
preferred contact time, notes, **photo upload** ("snap a picture of the
job/stain" — high-intent, quote-ready). TCPA consent checkbox for SMS
follow-up. Instant SMS/email alert to owner. Lead inbox with pipeline status
(new → contacted → won/lost) + **job value field** — this powers ROI math.

**L4 — Call & text capture (Zilla anchor feature):**
Twilio tracking number per business, forwarding to their real line.
- Log every call: caller ID, duration, time, answered/missed, **which card
  sourced it** (per-card tracking numbers at Zilla = true per-card call
  attribution, the thing CallRail can't tie to a physical object).
- **Missed-call instant text-back** ("Sorry we missed you — reply here and
  we'll get right back") — the single highest-ROI feature for one-truck
  operators; missed calls are their #1 revenue leak.
- Inbound SMS logged as leads + forwarded.
- Fast-follow (feature-flagged): recording with compliance whisper, AI
  transcript + one-line summary + auto-lead creation from calls.

**L5 — Lead enrichment (Zilla, feature-flagged adapters):**
on capture: reverse phone/email lookup (Trestle-class) → verified name,
address; property lookup (BatchData/ATTOM-class) → homeowner status, sq ft,
year built, est. value. Lead score from enrichment + behavior (returning
visitor, coupon copied, pricing viewed ×3). Adapter interface
`EnrichmentProvider` — vendors swappable, per-lookup costs metered.

**L6 — Platform intelligence (ours, aggregate/anonymized):**
cross-tenant benchmarks by industry ("carpet cleaners average 34 taps/mo",
"you're top 10%") — surfaced in-app as motivation/upsell, and used in
Tapzilla's own marketing. Admin cohort dashboards: activation, tap velocity,
feature usage, churn signals (taps trending to zero = churn risk → automated
win-back email).

## Dashboard UI by tier

- **Starter:** hero number (taps this month) + sparkline + last-7-days strip.
  Below: the full Pro dashboard rendered **blurred with real shapes** and an
  unlock CTA ("Your per-card data is being recorded right now").
- **Pro:** the workhorse. Funnel (taps → engaged → contact action → lead),
  per-card table (each physical card: taps, actions, leads), per-button
  breakdown, geo map, device split, hour/day heatmap, new vs returning,
  medium split (NFC/QR/share), lead inbox with pipeline + values, CSV export.
- **Zilla — the full shebang:** everything above plus call intelligence
  (call log, per-card call attribution, missed-call recovery stats,
  recordings/transcripts when enabled), enriched lead profiles, visitor
  journey timelines (tapped Tue → returned Thu → called Fri), page comparison,
  webhooks/Zapier, scheduled email reports.
- **ROI header on every tier:** leads × marked values → "Your cards drove
  $4,300 this month." Weekly summary email (Pro+) repeats it. This number is
  the renewal engine and must be the first thing the eye lands on.

## Privacy & compliance guardrails (also sales points)

First-party only — no ad pixels, no cross-site tracking, no data sale. Coarse
geo only, raw IPs dropped post-resolution. Visitor IDs are per-business (no
cross-tenant identity joins). Call-recording default OFF until consent whisper
is configured; per-state two-party consent handled before enabling. TCPA
consent on forms. Auto-generated privacy policy page per business. CCPA-style
delete endpoint. Enrichment runs only on business-consented captured leads,
never on anonymous visitors. "We track everything about your card — and
nothing about anyone across the web" is the positioning line.

## Schema additions

`visitors` (per-business first-party id), `taps` (sessions: visitor_id,
card_code, medium, device, geo, duration, scroll), `tap_events` (typed event
stream), `leads` (+status, value_cents, consent flags, enrichment JSONB,
score), `tracking_numbers`, `calls`, `sms_messages`, `enrichment_lookups`
(vendor, cost, result), `benchmarks` (materialized aggregates). Events write
via a single ingest API route (sendBeacon-friendly, sub-50ms, no client SDK
bloat — the page must stay fast on cheap phones).

## Cost sanity (Zilla margin check)

Twilio number ≈ $1.15/mo + pennies/min; Trestle-class lookups ≈ $0.03–0.10;
property lookups metered with monthly included quota (e.g. 100 enrichments/mo,
then metered). Zilla at $99/mo carries all of it comfortably — CallRail alone
retails at $45+/mo for less attribution than we give.
