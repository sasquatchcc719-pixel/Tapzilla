import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const head = columns.join(",");
  const body = rows.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n");
  return `${head}\n${body}\n`;
}

/** CSV export (Pro+): /api/export?what=leads|taps */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!business) return NextResponse.json({ error: "no business" }, { status: 404 });

  // Feature gate: csv_export from the plans table (Starter = locked)
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("business_id", business.id)
    .maybeSingle();
  const { data: plan } = await supabase
    .from("plans")
    .select("features")
    .eq("id", sub?.plan_id ?? "starter")
    .maybeSingle();
  if (!(plan?.features as Record<string, boolean>)?.csv_export) {
    return NextResponse.json({ error: "CSV export is a Pro feature" }, { status: 403 });
  }

  const what = req.nextUrl.searchParams.get("what") === "taps" ? "taps" : "leads";

  if (what === "leads") {
    const { data } = await supabase
      .from("leads")
      .select("created_at, name, phone, email, address, service, message, status, value_cents, source")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(5000);
    const csv = toCsv(data ?? [], [
      "created_at",
      "name",
      "phone",
      "email",
      "address",
      "service",
      "message",
      "status",
      "value_cents",
      "source",
    ]);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${business.slug}-leads.csv"`,
      },
    });
  }

  const { data } = await supabase
    .from("taps")
    .select("created_at, medium, device_type, os, browser, city, region, country, is_returning, card_id")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(20000);
  const csv = toCsv(data ?? [], [
    "created_at",
    "medium",
    "device_type",
    "os",
    "browser",
    "city",
    "region",
    "country",
    "is_returning",
    "card_id",
  ]);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${business.slug}-taps.csv"`,
    },
  });
}
