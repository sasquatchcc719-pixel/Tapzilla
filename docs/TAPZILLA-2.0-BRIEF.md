# Tapzilla 2.0 — Product Brief & Master Prompt

*Written 2026-07-13. This document is the source of truth for the relaunch direction.
It replaces the original "AI Salesperson Behind Every QR Code" positioning.*

---

## 1. The Pivot (why the old version is dead)

The original Tapzilla (Jan 2026 build, still deployed at tapzilla.vercel.app) was built
around NFC/QR taps opening **AI chat agents** that captured leads, billed per-lead.
Real-world experience at Sasquatch Carpet Cleaning killed that model:

- SMS-to-AI-agent handoff is painful to set up and fragile.
- AI agents are not reliable enough to represent a business unsupervised.
- What actually worked was replacing the agent with a **booking/estimate widget**
  and a rich **digital business card page**.

**Tapzilla is now the commercial version of the NFC marketing tools proven at
Sasquatch Carpet Cleaning** — self-serve, no phone calls with the founder required.

## 2. The proven reference product

The live reference is `sightings.sasquatchcarpet.com/tap` (source:
`Sasquatch Sightings/src/app/tap/page.tsx` on this machine). What it does:

- **Card hero image** — mirrors the physical NFC card/magnet the person just tapped.
- **Primary CTA: "Get a Free Estimate"** — expands an inline booking/price widget
  (`NfcBookingWidget`), coupon code auto-applied (e.g. SCC20 = $20 off).
- **Action stack**: Leave a Google Review, Call, Text (pre-filled message that
  identifies the tap source), Save to Contacts (server-served vCard so the phone
  opens "Add Contact" instead of downloading a file), Share (native share sheet
  with the deal baked into the share text).
- **Tap analytics**: every page view creates a tap record (`/api/tap/track`);
  every button click is attributed to that tap. Card ID and partner ID come in as
  query params, so each physical card/placard is individually trackable.
- **Partner placard mode**: `?partner=` redirects to a vendor-location page
  (wall installations inside partner businesses) — this is the second product.
- **Trust content**: service-area strip, recent-jobs carousel, recommended
  contractors, push-notification opt-in for deals.

Physical product today: black hotel-key NFC cards + sticker + glued magnet,
assembled by hand. That works at one-business scale and must be automated away.

## 3. What Tapzilla 2.0 is

A self-serve platform where a local business can **build, buy, and track** an NFC
business-card/magnet product without ever talking to us.

### Product line (in order)
1. **Smart card / magnet** (LAUNCH FOCUS) — physical NFC card+magnet that opens
   the customer's own version of the /tap page.
2. **Vendor partner placards** (LATER) — wall installations for partner locations,
   with per-location tracking and rewards.

### The three pillars to build

**A. The Builder (customer-facing front end)**
Two entry paths into the same underlying page model, because "people are dumb"
and many won't touch AI:

- *Simple path (default)*: pick a template → fill in obvious fields (business
  name, logo, phone, colors, booking link, coupon) → live phone-frame preview
  updates instantly. Block-based page: reorderable, toggleable sections
  (hero card, CTA, call/text/save/share row, review link, gallery, service areas).
  Show real finished examples (Sasquatch card as the flagship demo) so people
  copy instead of create.
- *AI path (optional)*: a chat/assistant panel that interviews the owner
  ("what's your business, what do you want people to do when they tap") and
  drafts the page + card design for them. AI assists the builder — it is NOT
  the product the end consumer touches.

Output of either path: a published page at a Tapzilla URL (e.g.
`tapzilla.com/t/[slug]`) + a card design (front/back artwork with NFC target URL).

**B. The Card Pages (the end-consumer product)**
The multi-tenant version of the Sasquatch /tap page. Per-business config drives:
hero image, CTA type (booking embed / lead form / link out to their scheduler),
coupon codes, action buttons, vCard, share text, review link, content blocks.
Every tap and click tracked per physical card.

**C. Fulfillment (the back end that removes the founder from the loop)**
Order flow: customer finishes design → pays (Stripe: hardware + subscription) →
order record created → artwork + NFC encoding spec (the card's unique URL)
pushed to a print/fulfillment partner via API → partner prints, encodes,
ships direct to customer → webhook updates order status → customer gets
tracking email. Admin dashboard shows the whole pipeline and lets us
manually intervene only when something breaks.

*Open research task*: pick the fulfillment partner. Requirements: API or at
least CSV/email-order automation, custom-printed NFC cards (and ideally
magnets or magnet-backing), per-unit NDEF URL encoding, dropshipping to the
end customer, sane unit economics at qty 1–10 per order. Candidates to
evaluate: NFC card printers with APIs (e.g. NFC.cards, Zipnfc, TapTag,
Seritag, GoToTags, CardsPlug, white-label programs from Popl/Wave/Linq),
plus generic print-API vendors if NFC inlay can be spec'd. Verify current
offerings before committing — this list is a starting point, not a decision.

## 4. Architecture & migration notes

Keep: Next.js 14 App Router, Tailwind, Supabase (Postgres + Auth + RLS),
Stripe, Vercel (repo `sasquatchcc719-pixel/Tapzilla` is connected, production
branch `main`, auto-deploys).

Schema: current tables (`companies`, `qr_codes`, `scans`, `conversations`,
`leads`, per-lead `billing_events`) reflect the dead model. Redesign around:
`businesses`, `card_pages` (block config JSON), `cards` (physical units, each
with unique code → page), `taps` (view + click events), `orders` /
`order_items` / `fulfillment_events`, `subscriptions`. The `/c/[code]` chat
route and `/api/chat` OpenAI dependency are retired; salvage the tracking
patterns from Sasquatch's `/api/tap/track` instead.

Pricing model shifts from per-lead billing to: hardware purchase (card/magnet)
+ monthly subscription for the hosted page, analytics, and edits. (Exact
pricing TBD.)

Brand: keep the robo-zilla logo (`public/Tapzilla.svg`) and dark
circuit-board aesthetic. Marketing copy must be rewritten from "AI salesperson"
to "the business card that books jobs" / smart-card positioning.

## 5. Roadmap (each phase shippable)

1. **Reposition the marketing site** — new copy/design around the smart card
   product, Sasquatch card as the live demo.
2. **Card pages engine** — multi-tenant /t/[slug] pages + tap tracking + block
   renderer (port & generalize the Sasquatch /tap page).
3. **The Builder** — simple template path first, live preview, publish flow,
   Stripe checkout. AI-assist panel second.
4. **Fulfillment research + integration** — pick partner, automate order → ship.
5. **Analytics dashboard** for customers (taps, clicks, sources, per-card).
6. **Vendor partner placard product** (port the partner-location system).
