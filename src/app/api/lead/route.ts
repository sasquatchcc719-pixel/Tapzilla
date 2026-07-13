import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const leadInput = z.object({
  businessId: z.string().uuid(),
  pageId: z.string().uuid(),
  name: z.string().min(1).max(120),
  phone: z.string().min(7).max(24),
  email: z.string().email().max(160).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  smsConsent: z.coerce.boolean().optional(),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const parsed = leadInput.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const d = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    business_id: d.businessId,
    page_id: d.pageId,
    source: "form",
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    address: d.address || null,
    service: d.service || null,
    message: d.message || null,
    sms_consent: Boolean(d.smsConsent),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Instant owner alerts (email/SMS) land in Phase 4 with Resend/Twilio keys.
  return NextResponse.json({ ok: true });
}
