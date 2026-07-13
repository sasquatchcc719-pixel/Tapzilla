import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const input = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "won", "lost"]).optional(),
  value_cents: z.number().int().min(0).max(100_000_000).optional(),
});

/** Owner-only lead pipeline updates (RLS enforces ownership). */
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
  const parsed = input.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const { id, ...fields } = parsed.data;
  if (!Object.keys(fields).length) return NextResponse.json({ ok: true });

  const { error } = await supabase.from("leads").update(fields).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
