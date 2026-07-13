import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Business-name → Google Place lookup, so owners never hunt for their own
 * review link. We return candidates; the client builds the review deep link
 * from place_id: https://search.google.com/local/writereview?placeid=<id>
 *
 * Uses Places API (New) Text Search. Set GOOGLE_MAPS_API_KEY (Places API New
 * enabled). Without a key the endpoint reports "not configured" so the UI
 * falls back to manual entry.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 3) return NextResponse.json({ results: [] });

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === "REPLACE_ME") {
    return NextResponse.json({ configured: false, results: [] });
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery: q, maxResultCount: 6 }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
    }
    const data = (await res.json()) as {
      places?: { id: string; displayName?: { text: string }; formattedAddress?: string }[];
    };
    const results = (data.places ?? []).map((p) => ({
      placeId: p.id,
      name: p.displayName?.text ?? "Unknown",
      address: p.formattedAddress ?? "",
    }));
    return NextResponse.json({ configured: true, results });
  } catch {
    return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
  }
}
