"use client";

import type { PageConfig } from "@/lib/page-config/schema";
import { PageRenderer } from "@/components/card-page/PageRenderer";

/** Live phone-frame preview. Tracking disabled — editing never pollutes analytics. */
export function PhonePreview({ config }: { config: PageConfig }) {
  return (
    <div className="mx-auto w-[375px] max-w-full">
      <div className="rounded-[2.4rem] border-[6px] border-neutral-800 bg-black shadow-2xl ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-neutral-900" />
          <div className="h-[660px] overflow-y-auto overscroll-contain">
            <PageRenderer
              config={config}
              meta={{ pageId: "", businessId: "", slug: "preview", shareUrl: "#" }}
              preview
            />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-white/40">
        Live preview — exactly what people see when they tap your card
      </p>
    </div>
  );
}
