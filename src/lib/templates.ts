import { pageConfigSchema, type PageConfig } from "@/lib/page-config/schema";

export type Template = {
  id: string;
  name: string;
  industry: string;
  description: string;
  /** Builds a full config; caller overwrites business fields afterwards. */
  build: (businessName: string) => PageConfig;
};

function make(config: unknown): PageConfig {
  return pageConfigSchema.parse(config);
}

export const TEMPLATES: Template[] = [
  {
    id: "service-pro",
    name: "Service Pro",
    industry: "home-services",
    description: "The proven layout: big estimate button, coupon, call/text, reviews. Our best performer.",
    build: (name) =>
      make({
        version: 1,
        theme: { preset: "dark", primary: "#00d9d5", accent: "#ff7f0a", background: "gradient" },
        business: { name, serviceAreas: [] },
        blocks: [
          { type: "hero_card" },
          { type: "cta_booking", headline: "Get a Free Estimate", style: "form" },
          { type: "action_row" },
          { type: "review_cta" },
          { type: "coupon" },
          { type: "service_areas" },
          {
            type: "lead_form",
            headline: "Request a Quote",
            askAddress: true,
            askService: true,
            serviceOptions: [],
          },
        ],
      }),
  },
  {
    id: "booker",
    name: "The Booker",
    industry: "appointments",
    description: "Built around your existing online booking link (Calendly, Square, Housecall Pro…).",
    build: (name) =>
      make({
        version: 1,
        theme: { preset: "dark", primary: "#7c9aff", accent: "#ff7f0a", background: "gradient" },
        business: { name, serviceAreas: [] },
        blocks: [
          { type: "hero_card" },
          { type: "cta_booking", headline: "Book Online Now", buttonText: "Book Now", style: "link" },
          { type: "action_row" },
          { type: "hours", rows: [] },
          { type: "review_cta" },
          { type: "socials", links: [] },
        ],
      }),
  },
  {
    id: "storefront",
    name: "Storefront",
    industry: "retail-restaurant",
    description: "For shops and restaurants: hours, socials, links, and a review push.",
    build: (name) =>
      make({
        version: 1,
        theme: { preset: "dark", primary: "#ffd166", accent: "#ef476f", background: "solid" },
        business: { name, serviceAreas: [] },
        blocks: [
          { type: "hero_card" },
          { type: "action_row", call: true, text: false, save: true, share: true },
          { type: "hours", rows: [] },
          { type: "custom_links", links: [] },
          { type: "socials", links: [] },
          { type: "review_cta" },
        ],
      }),
  },
  {
    id: "portfolio",
    name: "Show Your Work",
    industry: "trades",
    description: "Gallery-forward for painters, landscapers, detailers — proof first, contact second.",
    build: (name) =>
      make({
        version: 1,
        theme: { preset: "dark", primary: "#4ade80", accent: "#f59e0b", background: "gradient" },
        business: { name, serviceAreas: [] },
        blocks: [
          { type: "hero_card" },
          { type: "gallery", title: "Recent Work", images: [] },
          { type: "cta_booking", headline: "Get a Free Quote", style: "form" },
          { type: "action_row" },
          { type: "review_cta" },
          { type: "service_areas" },
        ],
      }),
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
