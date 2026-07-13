import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  defaultPageConfig,
  pageConfigSchema,
  type PageConfig,
} from "@/lib/page-config/schema";
import { BUILDER_SYSTEM_PROMPT } from "@/lib/builder-agent/prompt";
import { scrapeBusinessSite } from "@/lib/builder-agent/scrape";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.BUILDER_MODEL ?? "claude-sonnet-5";
const MAX_TOOL_ITERATIONS = 8; // per request
const MAX_HISTORY = 40; // messages of chat history sent to the model

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(MAX_HISTORY),
  config: z.unknown().nullable(),
  sessionKey: z.string().max(64).optional(),
});

const TOOLS: Anthropic.Tool[] = [
  {
    name: "update_page",
    description:
      "Update the customer's page. Fields you include are changed; fields you omit stay as they are. business and theme merge field-by-field; blocks REPLACES the entire section list, so always send the full list when changing sections.",
    input_schema: {
      type: "object",
      properties: {
        business: { type: "object", description: "Partial business info to merge" },
        theme: { type: "object", description: "Partial theme to merge (preset, primary, accent, background)" },
        blocks: { type: "array", description: "FULL replacement list of page sections", items: { type: "object" } },
      },
    },
  },
  {
    name: "fetch_website",
    description:
      "Fetch the business's website or Google Business page and extract facts (name, phone, services, areas, socials, hours). Call this immediately when the user shares a URL.",
    input_schema: {
      type: "object",
      properties: { url: { type: "string", description: "The website address" } },
      required: ["url"],
    },
  },
];

type Merge = { business?: Record<string, unknown>; theme?: Record<string, unknown>; blocks?: unknown[] };

function applyUpdate(current: PageConfig, patch: Merge): { config?: PageConfig; error?: string } {
  const candidate = {
    ...current,
    business: patch.business ? { ...current.business, ...patch.business } : current.business,
    theme: patch.theme ? { ...current.theme, ...patch.theme } : current.theme,
    blocks: patch.blocks ?? current.blocks,
  };
  const parsed = pageConfigSchema.safeParse(candidate);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `Invalid: ${issue.path.join(".")} — ${issue.message}` };
  }
  return { config: parsed.data };
}

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const body = bodySchema.safeParse(raw);
  if (!body.success) return new Response("invalid", { status: 400 });

  const configParse = pageConfigSchema.safeParse(body.data.config);
  let config: PageConfig = configParse.success ? configParse.data : defaultPageConfig("Your Business");

  const anthropic = new Anthropic();
  const encoder = new TextEncoder();
  const usage = { input: 0, output: 0, cacheRead: 0, turns: 0 };

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (obj: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
        // Chat history is text-only; the current page state is injected into
        // the last user turn so the model always sees fresh state (tool_use
        // blocks never need to persist across requests).
        const history: Anthropic.MessageParam[] = body.data.messages.map((m, i, arr) =>
          i === arr.length - 1 && m.role === "user"
            ? {
                role: "user" as const,
                content: `<current_page>${JSON.stringify(config)}</current_page>\n\n${m.content}`,
              }
            : { role: m.role, content: m.content }
        );

        for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
          const msgStream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            output_config: { effort: "low" },
            system: [
              {
                type: "text",
                text: BUILDER_SYSTEM_PROMPT,
                cache_control: { type: "ephemeral" },
              },
            ],
            tools: TOOLS,
            messages: history,
          });

          msgStream.on("text", (delta) => emit({ type: "text", delta }));

          const message = await msgStream.finalMessage();
          usage.input += message.usage.input_tokens;
          usage.output += message.usage.output_tokens;
          usage.cacheRead += message.usage.cache_read_input_tokens ?? 0;
          usage.turns += 1;

          if (message.stop_reason !== "tool_use") break;

          history.push({ role: "assistant", content: message.content });
          const results: Anthropic.ToolResultBlockParam[] = [];

          for (const block of message.content) {
            if (block.type !== "tool_use") continue;
            if (block.name === "update_page") {
              const { config: next, error } = applyUpdate(config, block.input as Merge);
              if (next) {
                config = next;
                emit({ type: "config", config });
                results.push({ type: "tool_result", tool_use_id: block.id, content: "Page updated. The user can see it in the preview now." });
              } else {
                results.push({ type: "tool_result", tool_use_id: block.id, content: error ?? "Invalid update", is_error: true });
              }
            } else if (block.name === "fetch_website") {
              emit({ type: "status", message: "Reading their website…" });
              const url = String((block.input as { url?: string }).url ?? "");
              const scraped = await scrapeBusinessSite(url);
              results.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: scraped.ok ? JSON.stringify(scraped.data) : scraped.error,
                is_error: !scraped.ok,
              });
            } else {
              results.push({ type: "tool_result", tool_use_id: block.id, content: "Unknown tool", is_error: true });
            }
          }
          history.push({ role: "user", content: results });
        }

        emit({ type: "done", config });
      } catch (err) {
        emit({
          type: "error",
          message: "Something went wrong on my end — try that again.",
        });
        console.error("builder-chat error", err);
      } finally {
        controller.close();
        // Fire-and-forget usage log
        try {
          const supabase = await createClient();
          await supabase.from("ai_usage").insert({
            session_key: body.data.sessionKey ?? null,
            model: MODEL,
            input_tokens: usage.input,
            output_tokens: usage.output,
            cache_read_tokens: usage.cacheRead,
            turns: usage.turns,
          });
        } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" },
  });
}
