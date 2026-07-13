import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { safeParsePageConfig } from "@/lib/page-config/schema";
import { CardArt, slotsFromConfig, type CardTemplateId } from "@/lib/card-templates";
import { qrForUrl } from "@/lib/card-templates/qr";

export const dynamic = "force-dynamic";

/** Unbounded TTFs fetched once per lambda, written to tmp for resvg
 * (this resvg version takes font file paths, not buffers). */
let fontFilesCache: string[] | null = null;
async function loadFonts(): Promise<string[]> {
  if (fontFilesCache) return fontFilesCache;
  const { writeFile } = await import("fs/promises");
  const { tmpdir } = await import("os");
  const { join } = await import("path");
  const urls: [string, string][] = [
    ["https://cdn.jsdelivr.net/fontsource/fonts/unbounded@latest/latin-400-normal.ttf", "unbounded-400.ttf"],
    ["https://cdn.jsdelivr.net/fontsource/fonts/unbounded@latest/latin-700-normal.ttf", "unbounded-700.ttf"],
  ];
  const paths = await Promise.all(
    urls.map(async ([u, name]) => {
      const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
      const p = join(tmpdir(), name);
      await writeFile(p, buf);
      return p;
    })
  );
  fontFilesCache = paths;
  return paths;
}

/**
 * Print file for a page's card design. Owner-only.
 * /api/card-file/[pageId]?side=front|back&format=svg|png
 * PNG is 300 DPI with bleed — what a print vendor receives.
 */
export async function GET(req: NextRequest, { params }: { params: { pageId: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { data: page } = await supabase
    .from("card_pages")
    .select("id, slug, config, business_id, businesses!inner(owner_id)")
    .eq("id", params.pageId)
    .single();
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });

  const parsed = safeParsePageConfig(page.config);
  if (!parsed.success) return NextResponse.json({ error: "bad config" }, { status: 500 });

  const { data: design } = await supabase
    .from("card_designs")
    .select("template_id")
    .eq("page_id", page.id)
    .limit(1)
    .maybeSingle();

  const side = req.nextUrl.searchParams.get("side") === "back" ? "back" : "front";
  const format = req.nextUrl.searchParams.get("format") === "png" ? "png" : "svg";
  const template = (design?.template_id ?? "voltage") as CardTemplateId;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tapzilla.vercel.app";
  const qr = await qrForUrl(`${appUrl}/p/${page.slug}?m=qr`);
  const slots = {
    ...slotsFromConfig(parsed.data),
    qr,
    siteHost: appUrl.replace(/^https?:\/\//, ""),
  };

  // Runtime require: Next's bundler rejects react-dom/server in route files,
  // but the node runtime loads it fine — this keeps one source of truth for
  // preview and print rendering.
  const { renderToStaticMarkup } = (eval("require") as NodeRequire)(
    "react-dom/server"
  ) as typeof import("react-dom/server");
  const svg = renderToStaticMarkup(
    createElement(CardArt, { template, side, slots, bleed: true })
  );

  const filename = `${page.slug}-${side}`;

  if (format === "svg") {
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>\n${svg}`, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${filename}.svg"`,
      },
    });
  }

  // 300 DPI PNG incl. bleed: 3.625in × 2.375in
  const { Resvg } = await import("@resvg/resvg-js");
  const fontFiles = await loadFonts();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1088 },
    font: {
      fontFiles,
      defaultFontFamily: "Unbounded",
      loadSystemFonts: true,
    },
  });
  const png = resvg.render().asPng();
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}.png"`,
    },
  });
}
