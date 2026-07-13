import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MEDIA = new Set(["nfc", "qr", "share", "direct"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseUA(ua: string) {
  const os = /iPhone|iPad|iOS/i.test(ua)
    ? "iOS"
    : /Android/i.test(ua)
      ? "Android"
      : /Mac OS X/i.test(ua)
        ? "macOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : "Other";
  const deviceType = /iPad|Tablet/i.test(ua)
    ? "tablet"
    : /Mobi|iPhone|Android/i.test(ua)
      ? "mobile"
      : "desktop";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Safari\//.test(ua)
        ? "Safari"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : "Other";
  return { os, deviceType, browser };
}

export async function POST(req: NextRequest) {
  // sendBeacon posts text/plain — parse manually rather than req.json()
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const supabase = await createClient();

  if (body.kind === "tap") {
    const { pageId, businessId, cardId, medium, visitorKey, isReturning } = body as Record<string, string>;
    if (!UUID_RE.test(pageId ?? "") || !UUID_RE.test(businessId ?? "")) {
      return NextResponse.json({ error: "bad ids" }, { status: 400 });
    }
    const ua = req.headers.get("user-agent") ?? "";
    const { os, deviceType, browser } = parseUA(ua);
    // Mint the id here: anon has INSERT but not SELECT on taps, so RETURNING
    // would trip RLS. No .select() on any public-telemetry insert.
    const tapId = crypto.randomUUID();
    const { error } = await supabase
      .from("taps")
      .insert({
        id: tapId,
        page_id: pageId,
        business_id: businessId,
        card_id: cardId && UUID_RE.test(cardId) ? cardId : null,
        visitor_key: visitorKey && UUID_RE.test(visitorKey) ? visitorKey : null,
        is_returning: Boolean(isReturning),
        medium: MEDIA.has(medium) ? medium : "direct",
        device_type: deviceType,
        os,
        browser,
        // Vercel edge geo headers; absent in local dev
        city: req.headers.get("x-vercel-ip-city") ?? null,
        region: req.headers.get("x-vercel-ip-country-region") ?? null,
        country: req.headers.get("x-vercel-ip-country") ?? null,
      });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tapId });
  }

  if (body.kind === "event") {
    const { tapId, businessId, eventType, payload } = body as Record<string, unknown>;
    if (
      !UUID_RE.test(String(tapId ?? "")) ||
      !UUID_RE.test(String(businessId ?? "")) ||
      typeof eventType !== "string" ||
      eventType.length > 64
    ) {
      return NextResponse.json({ error: "bad event" }, { status: 400 });
    }
    const { error } = await supabase.from("tap_events").insert({
      tap_id: tapId,
      business_id: businessId,
      event_type: eventType,
      payload: typeof payload === "object" && payload !== null ? payload : {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown kind" }, { status: 400 });
}
