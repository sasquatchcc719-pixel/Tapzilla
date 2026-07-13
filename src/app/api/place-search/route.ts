import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Business-name → Google Place lookup, so owners never hunt for their own
 * review link. We return candidates; the client builds the review deep link
 * from place_id: https://search.google.com/local/writereview?placeid=<id>
 *
 * Uses SerpApi's google_maps engine (SERPAPI_API_KEY) — the same key already
 * used across the founder's other software. Without a key the endpoint reports
 * "not configured" so the UI falls back to manual entry.
 */

type MapsResult = { place_id?: string; title?: string; address?: string };

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 3) return NextResponse.json({ results: [] });

  const key = process.env.SERPAPI_API_KEY;
  if (!key || key === "REPLACE_ME") {
    return NextResponse.json({ configured: false, results: [] });
  }

  const params = new URLSearchParams({
    engine: "google_maps",
    type: "search",
    q,
    gl: "us",
    hl: "en",
    api_key: key,
  });

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`, {
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) {
      return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
    }
    const data = (await res.json()) as {
      local_results?: MapsResult[];
      place_results?: MapsResult;
      error?: string;
    };

    // A strong single match comes back as place_results; a list as local_results
    const raw: MapsResult[] = data.place_results
      ? [data.place_results]
      : data.local_results ?? [];

    const results = raw
      .filter((p) => p.place_id)
      .slice(0, 6)
      .map((p) => ({
        placeId: p.place_id as string,
        name: (p.title ?? "").trim() || "Unknown",
        address: (p.address ?? "").trim(),
      }));

    return NextResponse.json({ configured: true, results });
  } catch {
    return NextResponse.json({ configured: true, results: [], error: "search_failed" }, { status: 502 });
  }
}
