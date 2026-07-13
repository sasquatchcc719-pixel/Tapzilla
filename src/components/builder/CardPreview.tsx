"use client";

import { useEffect, useState } from "react";
import type { PageConfig } from "@/lib/page-config/schema";
import {
  CARD_TEMPLATES,
  CardArt,
  slotsFromConfig,
  type CardSlots,
  type CardTemplateId,
} from "@/lib/card-templates";

/** Physical card preview: front/back flip + template picker.
 * QR is generated client-side against the page's shareable URL. */
export function CardPreview({
  config,
  slug,
  templateId,
  onTemplate,
}: {
  config: PageConfig;
  slug?: string;
  templateId: CardTemplateId;
  onTemplate: (t: CardTemplateId) => void;
}) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [qr, setQr] = useState<CardSlots["qr"]>(undefined);

  const url = `${typeof window !== "undefined" ? window.location.origin : "https://tapzilla.vercel.app"}/p/${slug ?? "your-page"}?m=qr`;

  useEffect(() => {
    let alive = true;
    import("@/lib/card-templates/qr").then(({ qrForUrl }) =>
      qrForUrl(url).then((q) => alive && setQr(q))
    );
    return () => {
      alive = false;
    };
  }, [url]);

  const slots: CardSlots = {
    ...slotsFromConfig(config),
    qr,
    siteHost: "tapzilla.vercel.app",
  };

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <button
        type="button"
        onClick={() => setSide(side === "front" ? "back" : "front")}
        className="block w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15 transition-transform hover:scale-[1.01]"
        title="Flip card"
      >
        <CardArt template={templateId} side={side} slots={slots} className="block w-full" />
      </button>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTemplate(t.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                templateId === t.id
                  ? "border-primary-400 text-primary-300"
                  : "border-white/15 text-white/50 hover:border-white/40"
              }`}
              title={t.blurb}
            >
              {t.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSide(side === "front" ? "back" : "front")}
          className="text-xs text-white/50 hover:text-white"
        >
          ↻ Flip to {side === "front" ? "back" : "front"}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-white/40">
        Your physical card — colors, coupon & phone come straight from your page
      </p>
    </div>
  );
}
