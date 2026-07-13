# Fulfillment Partner Research — NFC Card/Magnet Manufacturing

*Researched 2026-07-13. Conclusion: there is no true "Printful for NFC" with a
public order API today. The winning strategy is a provider abstraction layer +
a launch partner + a scale partner.*

## The landscape

| Vendor | NFC? | Custom print per order | Per-card URL encoding | Order automation | Dropship | Turnaround | Notes |
|---|---|---|---|---|---|---|---|
| **TapTag** (taptag.shop, NY) | ✅ | ✅ edge-to-edge both sides | ✅ programs each item per order | ⚠️ Shopify integration only (no API) | ✅ blind, unbranded | **1 business day** (<25 items) | $75/product setup, +$45 customizer. Free US ship $30+. |
| **GoToTags** (US) | ✅ | ✅ PVC/wood/metal, CMYK | ✅ pre-encoding service | ❌ quote/order flow, no public API | ❓ negotiable | 15–20 business days | Serious industrial NFC house; 100 → 10M units. Scale partner. |
| **RFIDCard.com** | ✅ | ✅ | ✅ custom encoding | ❌ quote form | ❓ | ~10 working days | MOQ 100 — batch inventory, not per-customer orders. |
| **The Card Network** (UK) | ❓ | ✅ | ❓ | ✅ true zero-touch fulfillment API | ✅ mailing service | ❓ | The API model we want; UK-based, NFC unconfirmed. Worth a call. |
| **Printful / Prodigi / Gelato** | ❌ | ✅ | n/a | ✅ excellent APIs | ✅ | days | No NFC products. Prodigi does magnets — useful for non-NFC magnet add-ons. |
| **SWFT / wCard / QRCodeChimp** | ✅ | ✅ | ✅ | ✅-ish | ✅ | ❓ | White-label *platforms* — they replace Tapzilla's software. Competitors, not suppliers. |

Sources: [TapTag white label](https://taptag.shop/pages/white-label-nfc-items-digital-business-cards),
[GoToTags custom NFC cards](https://store.gototags.com/nfc-tags/nfc-cards/custom-nfc-cards/),
[GoToTags encoding service](https://store.gototags.com/nfc-tag-encoding-service/),
[RFIDCard NFC business cards](https://www.rfidcard.com/product/nfc-business-cards/),
[The Card Network API](https://www.thecardnetwork.co.uk/pages/api-integration),
[Prodigi magnets](https://www.prodigi.com/products/stickers/magnets/),
[Printful API](https://www.printful.com/api).

## The strategic unlock: we own the URL, not the vendor

Every physical card is encoded with a unique Tapzilla-owned short URL
(`tapzilla.com/t/{cardCode}`). The URL → page mapping lives in OUR database.
Consequences:

1. **Customers edit their page forever without reprinting.** The chip never changes.
2. **The manufacturer needs only two things per order: artwork files + a URL list.**
   No customer data, no software integration on their side.
3. **Vendors are interchangeable.** Any shop that can print PVC and write an
   NDEF URL record qualifies. We are never locked in.

## Recommended architecture: `FulfillmentProvider` interface

```
createOrder(artwork, urlList, shippingAddress) → providerOrderId
getStatus(providerOrderId) → status + tracking
(webhook or poll) → fulfillment_events
```

Adapters, in rollout order:

- **Phase A — `ManualProvider` (day one):** admin queue. Each paid order renders
  print-ready PDFs + URL list; founder clicks "sent to vendor," pastes tracking.
  Works with TapTag checkout or hand assembly. Zero risk, ships immediately.
- **Phase B — `TapTagShopifyProvider`:** drive TapTag through their Shopify
  integration (create draft orders programmatically via Shopify Admin API into
  a store connected to TapTag). 1-day turnaround, blind dropship = the Etsy
  experience.
- **Phase C — negotiated direct API/CSV** with GoToTags (US scale) or The Card
  Network-style zero-touch partner once volume justifies the conversation.
  At real volume these vendors will build the integration with us.

## Action items (human calls required)

1. Email TapTag: per-order unique URL encoding via Shopify flow, dropship
   packaging, magnet-backed card options, volume pricing.
2. Email GoToTags: minimums for recurring weekly variable-data orders,
   API/CSV order intake, dropship-to-end-customer willingness.
3. Call The Card Network: NFC capability + US shipping on their fulfillment API.
4. Prodigi account for non-NFC magnet companion products (has real API today).
