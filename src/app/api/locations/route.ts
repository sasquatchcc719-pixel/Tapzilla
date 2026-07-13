import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Vendor placard locations — the tracked codes mounted in host businesses.
 * Capped per plan (plans.max_locations): Pro 3, Zilla 15, Starter 0. */

function mintCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
}

async function ownerContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!business) return null;
  const { data: page } = await supabase
    .from("card_pages")
    .select("id")
    .eq("business_id", business.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("business_id", business.id)
    .maybeSingle();
  const { data: plan } = await supabase
    .from("plans")
    .select("max_locations")
    .eq("id", sub?.plan_id ?? "starter")
    .maybeSingle();
  return { businessId: business.id, pageId: page?.id ?? null, maxLocations: plan?.max_locations ?? 0 };
}

export async function GET() {
  const supabase = await createClient();
  const ctx = await ownerContext(supabase);
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { data: locations } = await supabase
    .from("cards")
    .select("id, card_code, label, status, created_at")
    .eq("business_id", ctx.businessId)
    .eq("product_type", "placard")
    .order("created_at", { ascending: true });

  return NextResponse.json({
    locations: locations ?? [],
    maxLocations: ctx.maxLocations,
  });
}

const createInput = z.object({ name: z.string().min(1).max(80) });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const ctx = await ownerContext(supabase);
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });
  if (!ctx.pageId) return NextResponse.json({ error: "Publish your page first." }, { status: 400 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const input = createInput.safeParse(raw);
  if (!input.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { count } = await supabase
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("business_id", ctx.businessId)
    .eq("product_type", "placard")
    .eq("status", "active");
  if ((count ?? 0) >= ctx.maxLocations) {
    return NextResponse.json(
      { error: "location_limit", maxLocations: ctx.maxLocations },
      { status: 403 }
    );
  }

  const { data: location, error } = await supabase
    .from("cards")
    .insert({
      card_code: mintCode(),
      business_id: ctx.businessId,
      page_id: ctx.pageId,
      product_type: "placard",
      label: input.data.name,
    })
    .select("id, card_code, label, status, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ location });
}

const patchInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "disabled"]).optional(),
  name: z.string().min(1).max(80).optional(),
});

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const ctx = await ownerContext(supabase);
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const input = patchInput.safeParse(raw);
  if (!input.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const fields: Record<string, string> = {};
  if (input.data.status) fields.status = input.data.status;
  if (input.data.name) fields.label = input.data.name;
  const { error } = await supabase
    .from("cards")
    .update(fields)
    .eq("id", input.data.id)
    .eq("business_id", ctx.businessId)
    .eq("product_type", "placard");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
