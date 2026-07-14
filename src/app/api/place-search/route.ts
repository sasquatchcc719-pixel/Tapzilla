import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Business-name → Google Place lookup, so owners never hunt for their own
 * review link. Uses Google Places Autocomplete (New) — the correct tool for
 * "type a business name, get THAT listing" (name matching, not rank search).
 * We return candidates; the client builds the review deep link from place_id:
 *   https://search.google.com/local/writereview?placeid=<id>
 *
 * Needs GOOGLE_MAPS_API_KEY with "Places API (New)" enabled. Without a key the
 * endpoint reports "not configured" so the UI falls back to manual entry.
 */

type Suggestion = {
  placePrediction?: {
    placeId?: string;
    structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
    text?: { text?: string };
  };
};

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 3) return NextResponse.json({ results: [] });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === "REPLACE_ME") {
    return NextResponse.json({ configured: false, results: [] });
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({ input: q, includedRegionCodes: ["us"] }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
    }
    const data = (await res.json()) as { suggestions?: Suggestion[] };
    const results = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
      .slice(0, 6)
      .map((p) => ({
        placeId: p.placeId as string,
        name: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "Unknown",
        address: p.structuredFormat?.secondaryText?.text ?? "",
      }));
    return NextResponse.json({ configured: true, results });
  } catch {
    return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
  }
}
