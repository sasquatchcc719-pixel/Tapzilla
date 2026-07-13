import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { safeParsePageConfig } from "@/lib/page-config/schema";
import { PageRenderer } from "@/components/card-page/PageRenderer";

export const dynamic = "force-dynamic";

/** THE product URL — this is what's encoded on every chip. */
export default async function TapPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { m?: string };
}) {
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("cards")
    .select("id, page_id, business_id, status, product_type, label")
    .eq("card_code", params.code)
    .single();
  if (!card || card.status !== "active") notFound();

  const { data: page } = await supabase
    .from("card_pages")
    .select("id, slug, config, status, business_id")
    .eq("id", card.page_id)
    .single();
  if (!page || page.status !== "published") notFound();

  const parsed = safeParsePageConfig(page.config);
  if (!parsed.success) notFound();

  const medium = searchParams.m === "qr" ? "qr" : searchParams.m === "sh" ? "share" : "nfc";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tapzilla.vercel.app";

  return (
    <div className="min-h-screen bg-black">
      <PageRenderer
        config={parsed.data}
        meta={{
          pageId: page.id,
          businessId: page.business_id,
          slug: page.slug,
          shareUrl: `${appUrl}/p/${page.slug}?m=sh`,
        }}
        cardId={card.id}
        medium={medium}
        foundAt={card.product_type === "placard" ? card.label : null}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: card } = await supabase
    .from("cards")
    .select("page_id")
    .eq("card_code", params.code)
    .single();
  if (!card) return {};
  const { data: page } = await supabase
    .from("card_pages")
    .select("config")
    .eq("id", card.page_id)
    .single();
  const parsed = page ? safeParsePageConfig(page.config) : null;
  if (!parsed?.success) return {};
  const b = parsed.data.business;
  return {
    title: b.name,
    description: b.tagline ?? `Contact ${b.name}`,
    openGraph: { title: b.name, description: b.tagline ?? `Contact ${b.name}` },
  };
}
