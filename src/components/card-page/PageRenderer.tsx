"use client";

import type { PageConfig } from "@/lib/page-config/schema";
import { PageMetaContext, type PageMeta } from "./meta";
import { Tracker } from "./Tracker";
import {
  ActionRow,
  CouponBlock,
  CtaBooking,
  CustomLinks,
  Gallery,
  HeroCard,
  Hours,
  LeadFormBlock,
  ReviewCta,
  ServiceAreas,
  Socials,
} from "./blocks";

export type { PageMeta };

function CircuitBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-25"
      style={{
        backgroundImage: "url(/background-circuits.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

/**
 * Renders a validated PageConfig. Used by the live public page AND the
 * builder's phone-frame preview (with tracking disabled).
 */
export function PageRenderer({
  config,
  meta,
  cardId = null,
  medium = "direct",
  preview = false,
  foundAt = null,
}: {
  config: PageConfig;
  meta: PageMeta;
  cardId?: string | null;
  medium?: string;
  preview?: boolean;
  /** Placard taps: the host location's name ("Found at: …") */
  foundAt?: string | null;
}) {
  const { theme, business, blocks } = config;
  const enabledBlocks = blocks.filter((b) => b.enabled);

  return (
    <PageMetaContext.Provider value={meta}>
      <Tracker
        pageId={meta.pageId}
        businessId={meta.businessId}
        cardId={cardId}
        medium={medium}
        disabled={preview}
      >
        <div
          className="relative min-h-full w-full"
          style={
            {
              "--tz-primary": theme.primary,
              "--tz-accent": theme.accent,
              background:
                theme.background === "solid"
                  ? "#000"
                  : "radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--tz-primary) 18%, #000) 0%, #000 60%)",
            } as React.CSSProperties
          }
        >
          {theme.background === "circuit" ? <CircuitBackground /> : null}
          <div className="relative z-10 mx-auto max-w-md px-4 py-6">
            {enabledBlocks.map((block, i) => (
              <div key={i}>
                {renderBlock(block, i)}
                {i === 0 && foundAt ? (
                  <div className="mb-5 rounded-2xl border-2 border-amber-500/70 bg-black/70 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                      <span className="text-xl">🎁</span>
                      Found at: {foundAt}
                    </p>
                    <p className="mt-1 text-xs text-amber-200/80">
                      This location shares our service — thanks for scanning!
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
            {renderFooter()}
          </div>
        </div>
      </Tracker>
    </PageMetaContext.Provider>
  );

  function renderBlock(block: (typeof enabledBlocks)[number], _i: number) {
    switch (block.type) {
      case "hero_card":
        return <HeroCard block={block} business={business} />;
      case "cta_booking":
        return <CtaBooking block={block} business={business} />;
      case "action_row":
        return <ActionRow block={block} business={business} shareUrl={meta.shareUrl} />;
      case "review_cta":
        return <ReviewCta block={block} business={business} />;
      case "coupon":
        return <CouponBlock block={block} business={business} />;
      case "service_areas":
        return <ServiceAreas business={business} />;
      case "gallery":
        return <Gallery block={block} />;
      case "hours":
        return <Hours block={block} />;
      case "socials":
        return <Socials block={block} />;
      case "custom_links":
        return <CustomLinks block={block} />;
      case "lead_form":
        return <LeadFormBlock block={block} business={business} />;
      default:
        return null;
    }
  }

  function renderFooter() {
    return (
      <footer className="mt-8 pb-4 text-center text-xs text-white/50">
        <p>{business.name}</p>
        {business.serviceAreas.length ? <p>{business.serviceAreas.join(" • ")}</p> : null}
        {config.badge ? (
          <a
            href="https://tapzilla.vercel.app?utm_source=badge"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/60 hover:text-white"
          >
            ⚡ Powered by Tapzilla
          </a>
        ) : null}
      </footer>
    );
  }
}
