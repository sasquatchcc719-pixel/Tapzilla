import { z } from "zod";

/**
 * The page config document. This is THE product: the AI builder, the form
 * builder, and the renderer all operate on this one validated shape.
 * Version it; never let an invalid document into the database.
 */

export const themeSchema = z.object({
  preset: z.enum(["dark", "light"]).default("dark"),
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#00d9d5"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#ff7f0a"),
  background: z.enum(["circuit", "solid", "gradient"]).default("gradient"),
});

export const couponSchema = z.object({
  code: z.string().min(1).max(24),
  label: z.string().min(1).max(80), // "saves you $20 — auto-applied"
});

/** Business facts the page + vCard + buttons pull from. Snapshotted into the
 * config at publish so public rendering never reads the businesses table. */
export const businessInfoSchema = z.object({
  name: z.string().min(1).max(80),
  tagline: z.string().max(120).optional(),
  phone: z.string().max(24).optional(),
  smsBody: z.string().max(240).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().max(160).optional(),
  serviceAreas: z.array(z.string().max(48)).max(12).default([]),
  reviewUrl: z.string().url().optional(),
  bookingUrl: z.string().url().optional(),
  coupon: couponSchema.optional(),
});

const base = { enabled: z.boolean().default(true) };

export const blockSchemas = {
  hero_card: z.object({
    type: z.literal("hero_card"),
    ...base,
    imageUrl: z.string().url().optional(), // physical card mockup photo
  }),
  cta_booking: z.object({
    type: z.literal("cta_booking"),
    ...base,
    headline: z.string().max(60).default("Get a Free Estimate"),
    subline: z.string().max(90).optional(),
    buttonText: z.string().max(40).default("Get a Free Estimate"),
    style: z.enum(["link", "form"]).default("link"), // form = built-in lead form (Pro+)
  }),
  action_row: z.object({
    type: z.literal("action_row"),
    ...base,
    call: z.boolean().default(true),
    text: z.boolean().default(true),
    save: z.boolean().default(true),
    share: z.boolean().default(true),
    shareText: z.string().max(200).optional(),
  }),
  review_cta: z.object({
    type: z.literal("review_cta"),
    ...base,
    text: z.string().max(60).default("Leave Us a Review"),
  }),
  coupon: z.object({
    type: z.literal("coupon"),
    ...base,
    headline: z.string().max(60).default("Exclusive Deal"),
    subline: z.string().max(120).optional(),
  }),
  service_areas: z.object({
    type: z.literal("service_areas"),
    ...base,
  }),
  gallery: z.object({
    type: z.literal("gallery"),
    ...base,
    title: z.string().max(60).default("Recent Work"),
    images: z
      .array(z.object({ url: z.string().url(), caption: z.string().max(80).optional() }))
      .max(12)
      .default([]),
  }),
  hours: z.object({
    type: z.literal("hours"),
    ...base,
    rows: z
      .array(z.object({ day: z.string().max(20), hours: z.string().max(40) }))
      .max(8)
      .default([]),
  }),
  socials: z.object({
    type: z.literal("socials"),
    ...base,
    links: z
      .array(
        z.object({
          kind: z.enum(["facebook", "instagram", "tiktok", "youtube", "x", "linkedin", "google", "yelp", "nextdoor"]),
          url: z.string().url(),
        })
      )
      .max(9)
      .default([]),
  }),
  custom_links: z.object({
    type: z.literal("custom_links"),
    ...base,
    links: z
      .array(z.object({ label: z.string().max(48), url: z.string().url(), emoji: z.string().max(4).optional() }))
      .max(8)
      .default([]),
  }),
  lead_form: z.object({
    type: z.literal("lead_form"),
    ...base,
    headline: z.string().max(60).default("Request a Quote"),
    buttonText: z.string().max(40).default("Send Request"),
    askAddress: z.boolean().default(false),
    askService: z.boolean().default(true),
    askPhoto: z.boolean().default(false),
    serviceOptions: z.array(z.string().max(48)).max(10).default([]),
  }),
} as const;

export const blockSchema = z.discriminatedUnion("type", [
  blockSchemas.hero_card,
  blockSchemas.cta_booking,
  blockSchemas.action_row,
  blockSchemas.review_cta,
  blockSchemas.coupon,
  blockSchemas.service_areas,
  blockSchemas.gallery,
  blockSchemas.hours,
  blockSchemas.socials,
  blockSchemas.custom_links,
  blockSchemas.lead_form,
]);

export const pageConfigSchema = z.object({
  version: z.literal(1).default(1),
  theme: themeSchema.prefault({}),
  business: businessInfoSchema,
  blocks: z.array(blockSchema).max(20),
  badge: z.boolean().default(true), // "Powered by Tapzilla" — cleared for Pro+ at publish
});

export type PageConfig = z.infer<typeof pageConfigSchema>;
export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type BusinessInfo = z.infer<typeof businessInfoSchema>;

export function parsePageConfig(raw: unknown): PageConfig {
  return pageConfigSchema.parse(raw);
}

export function safeParsePageConfig(raw: unknown) {
  return pageConfigSchema.safeParse(raw);
}

/** A sensible starter document for new drafts. */
export function defaultPageConfig(name: string): PageConfig {
  return pageConfigSchema.parse({
    version: 1,
    business: { name },
    blocks: [
      { type: "hero_card" },
      { type: "cta_booking" },
      { type: "action_row" },
      { type: "review_cta" },
      { type: "service_areas" },
    ],
  });
}
