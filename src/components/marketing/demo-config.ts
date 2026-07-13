import { pageConfigSchema, type PageConfig } from "@/lib/page-config/schema";

/** The hero demo — a real PageConfig rendered by the real engine.
 * What visitors play with on the homepage IS the product. */
export const HERO_DEMO: PageConfig = pageConfigSchema.parse({
  version: 1,
  badge: false,
  theme: { preset: "dark", primary: "#00d9d5", accent: "#ff7f0a", background: "gradient" },
  business: {
    name: "Ridgeline Carpet Care",
    tagline: "Family-owned · 14 years in the Springs",
    phone: "(719) 555-0134",
    smsBody: "Hi! I tapped your card and I'm interested in carpet cleaning.",
    serviceAreas: ["Monument", "Colorado Springs", "Castle Rock"],
    reviewUrl: "https://example.com/review",
    coupon: { code: "TAP20", label: "saves you $20 — auto-applied" },
  },
  blocks: [
    { type: "hero_card" },
    { type: "cta_booking", headline: "Get a Free Estimate", buttonText: "Get a Free Estimate", style: "form" },
    { type: "action_row", shareText: "Get $20 off carpet cleaning with Ridgeline!" },
    { type: "review_cta" },
    { type: "coupon", headline: "Exclusive Tap Deal" },
    { type: "service_areas" },
  ],
});
