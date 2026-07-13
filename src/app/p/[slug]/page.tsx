import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { safeParsePageConfig } from "@/lib/page-config/schema";
import { PageRenderer } from "@/components/card-page/PageRenderer";

export const dynamic = "force-dynamic";

/** Shareable non-card URL for a published page. */
export default async function PublicPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { m?: string };
}) {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("card_pages")
    .select("id, slug, config, status, business_id")
    .eq("slug", params.slug)
    .single();
  if (!page || page.status !== "published") notFound();

  const parsed = safeParsePageConfig(page.config);
  if (!parsed.success) notFound();

  const medium = searchParams.m === "qr" ? "qr" : searchParams.m === "sh" ? "share" : "direct";
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
        medium={medium}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("card_pages")
    .select("config")
    .eq("slug", params.slug)
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
