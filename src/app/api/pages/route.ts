import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { pageConfigSchema } from "@/lib/page-config/schema";

export const dynamic = "force-dynamic";

const saveInput = z.object({
  pageId: z.string().uuid().optional(),
  publish: z.boolean().optional(),
  config: z.unknown(),
  cardTemplateId: z.enum(["voltage", "clean", "bold"]).optional(),
});

async function upsertCardDesign(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pageId: string,
  templateId: string
) {
  const { data: existing } = await supabase
    .from("card_designs")
    .select("id")
    .eq("page_id", pageId)
    .limit(1)
    .maybeSingle();
  if (existing) {
    await supabase.from("card_designs").update({ template_id: templateId }).eq("id", existing.id);
  } else {
    await supabase
      .from("card_designs")
      .insert({ page_id: pageId, source: "template", template_id: templateId });
  }
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "my-business"
  );
}

/** Create or update the caller's draft page (and its business row). */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const input = saveInput.safeParse(raw);
  if (!input.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const parsed = pageConfigSchema.safeParse(input.data.config);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid config", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 }
    );
  }
  const config = parsed.data;

  // Existing page → update
  if (input.data.pageId) {
    const { data: page, error } = await supabase
      .from("card_pages")
      .update({
        config,
        ...(input.data.publish ? { status: "published", published_at: new Date().toISOString() } : {}),
      })
      .eq("id", input.data.pageId)
      .select("id, slug, status")
      .single();
    if (error || !page) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (input.data.cardTemplateId) await upsertCardDesign(supabase, page.id, input.data.cardTemplateId);
    return NextResponse.json({ pageId: page.id, slug: page.slug, status: page.status });
  }

  // New page → find or create the user's business, then the page
  let businessId: string;
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    businessId = existing.id;
  } else {
    const base = slugify(config.business.name);
    const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data: biz, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: config.business.name,
        slug,
        phone: config.business.phone ?? null,
        email: config.business.email ?? null,
        website: config.business.website ?? null,
        google_review_url: config.business.reviewUrl ?? null,
        booking_url: config.business.bookingUrl ?? null,
      })
      .select("id")
      .single();
    if (error || !biz) return NextResponse.json({ error: error?.message }, { status: 500 });
    businessId = biz.id;
  }

  const base = slugify(config.business.name);
  // retry a few times on slug collision
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data: page, error } = await supabase
      .from("card_pages")
      .insert({
        business_id: businessId,
        slug,
        config,
        ...(input.data.publish ? { status: "published", published_at: new Date().toISOString() } : {}),
      })
      .select("id, slug, status")
      .single();
    if (!error && page) {
      if (input.data.cardTemplateId) await upsertCardDesign(supabase, page.id, input.data.cardTemplateId);
      return NextResponse.json({ pageId: page.id, slug: page.slug, status: page.status });
    }
    if (error && !/duplicate|unique/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "slug collision" }, { status: 500 });
}

/** Load the caller's most recent page (resume editing across devices). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { data: page } = await supabase
    .from("card_pages")
    .select("id, slug, status, config, businesses!inner(owner_id)")
    .eq("businesses.owner_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!page) return NextResponse.json({ page: null });
  return NextResponse.json({
    page: { pageId: page.id, slug: page.slug, status: page.status, config: page.config },
  });
}
