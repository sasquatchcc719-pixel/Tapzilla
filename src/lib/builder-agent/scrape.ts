import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

/** Fetch a business website and extract prefill fields with Haiku
 * (pure extraction — the cheapest model handles it per MASTER-PROMPT). */

const extracted = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  serviceAreas: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  industry: z.string().optional(),
  socialLinks: z.array(z.object({ kind: z.string(), url: z.string() })).optional(),
  bookingUrl: z.string().optional(),
  hours: z.array(z.object({ day: z.string(), hours: z.string() })).optional(),
  summary: z.string().optional(),
});

export type ScrapedBusiness = z.infer<typeof extracted>;

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function scrapeBusinessSite(url: string): Promise<
  { ok: true; data: ScrapedBusiness } | { ok: false; error: string }
> {
  let target: URL;
  try {
    target = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (!/^https?:$/.test(target.protocol)) throw new Error("bad protocol");
  } catch {
    return { ok: false, error: "That doesn't look like a valid website address." };
  }

  let html: string;
  try {
    const res = await fetch(target.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "TapzillaBuilder/1.0 (+https://tapzilla.vercel.app)" },
    });
    console.log("scrape status", target.toString(), res.status);
    if (!res.ok) return { ok: false, error: `The site responded with an error (${res.status}).` };
    html = (await res.text()).slice(0, 300_000);
  } catch (err) {
    console.error("scrape fetch failed", target.toString(), err);
    return { ok: false, error: "Couldn't reach that site — it may be down or blocking robots." };
  }

  // Keep meta tags (often hold the best summary/social data) + visible text
  const metas = Array.from(
    html.matchAll(/<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']*)["']/gi)
  )
    .map((m) => `${m[1]}: ${m[2]}`)
    .slice(0, 30)
    .join("\n");
  const text = htmlToText(html).slice(0, 9000);

  const anthropic = new Anthropic();
  try {
    // Plain JSON-by-prompt: our zod safeParse below is the real validator
    // (an enforced json_schema grammar was rejected as too complex for this model).
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Extract business facts from this website as a single JSON object with these optional keys: name, tagline, phone, email, address, serviceAreas (string array), services (string array), industry, socialLinks (array of {kind, url} where kind is one of facebook, instagram, tiktok, youtube, x, linkedin, google, yelp, nextdoor), bookingUrl, hours (array of {day, hours}), summary (1-2 sentences on what the business does).\n\nOnly include facts actually present — omit any key you can't find. Respond with ONLY the JSON object, no prose, no code fences.\n\nURL: ${target}\n\nMETA TAGS:\n${metas}\n\nPAGE TEXT:\n${text}`,
        },
      ],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      console.error("scrape: no text block", response.stop_reason);
      return { ok: false, error: "Extraction failed." };
    }
    const jsonText = textBlock.text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = extracted.safeParse(JSON.parse(jsonText));
    if (!parsed.success) {
      console.error("scrape: schema mismatch", parsed.error.issues[0]);
      return { ok: false, error: "Extraction failed." };
    }
    return { ok: true, data: parsed.data };
  } catch (err) {
    console.error("scrape extraction failed", err);
    return { ok: false, error: "Couldn't analyze the site — try telling me about the business instead." };
  }
}
