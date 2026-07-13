"use client";

import { useState } from "react";
import type { Block, BlockType, PageConfig } from "@/lib/page-config/schema";
import { blockSchemas } from "@/lib/page-config/schema";
import { Field, TextInput, Toggle } from "./fields";

const BLOCK_LABELS: Record<BlockType, string> = {
  hero_card: "Header / logo",
  cta_booking: "Big action button",
  action_row: "Call · Text · Save · Share",
  review_cta: "Review button",
  coupon: "Coupon",
  service_areas: "Service areas",
  gallery: "Photo gallery",
  hours: "Business hours",
  socials: "Social links",
  custom_links: "Custom links",
  lead_form: "Quote request form",
};

function defaultBlock(type: BlockType): Block {
  return blockSchemas[type].parse({ type });
}

export function BlocksEditor({
  config,
  onChange,
}: {
  config: PageConfig;
  onChange: (blocks: Block[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const blocks = config.blocks;

  const update = (i: number, patch: Partial<Block>) => {
    const next = blocks.slice();
    next[i] = { ...next[i], ...patch } as Block;
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(null);
  };
  const remove = (i: number) => {
    onChange(blocks.filter((_, k) => k !== i));
    setOpen(null);
  };
  const add = (type: BlockType) => {
    onChange([...blocks, defaultBlock(type)]);
    setOpen(blocks.length);
  };

  const present = new Set(blocks.map((b) => b.type));
  const addable = (Object.keys(BLOCK_LABELS) as BlockType[]).filter((t) => !present.has(t));

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => (
        <div key={`${block.type}-${i}`} className="rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Toggle checked={block.enabled} onChange={(v) => update(i, { enabled: v })} label="Show block" />
            <button
              type="button"
              className="flex-1 text-left text-sm font-medium text-white/90"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {BLOCK_LABELS[block.type]}
            </button>
            <button type="button" onClick={() => move(i, -1)} className="px-1 text-white/50 hover:text-white" aria-label="Move up">↑</button>
            <button type="button" onClick={() => move(i, 1)} className="px-1 text-white/50 hover:text-white" aria-label="Move down">↓</button>
            <button type="button" onClick={() => remove(i)} className="px-1 text-white/40 hover:text-red-400" aria-label="Remove">✕</button>
          </div>
          {open === i ? (
            <div className="border-t border-white/10 p-3">
              <BlockSettings block={block} onPatch={(p) => update(i, p)} />
            </div>
          ) : null}
        </div>
      ))}

      {addable.length ? (
        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Add a section</p>
          <div className="flex flex-wrap gap-1.5">
            {addable.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => add(t)}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:border-white/50 hover:text-white"
              >
                + {BLOCK_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* Per-block settings ------------------------------------------------------ */

function BlockSettings({
  block,
  onPatch,
}: {
  block: Block;
  onPatch: (patch: Partial<Block>) => void;
}) {
  switch (block.type) {
    case "hero_card":
      return (
        <Field label="Card photo URL" hint="Optional — a photo of your physical card. Without it we render your name, logo and phone.">
          <TextInput
            value={block.imageUrl ?? ""}
            placeholder="https://…"
            onChange={(e) => onPatch({ imageUrl: e.target.value || undefined } as Partial<Block>)}
          />
        </Field>
      );
    case "cta_booking":
      return (
        <div className="space-y-3">
          <Field label="Headline">
            <TextInput value={block.headline} onChange={(e) => onPatch({ headline: e.target.value } as Partial<Block>)} />
          </Field>
          <Field label="Subline">
            <TextInput
              value={block.subline ?? ""}
              placeholder="Shown under the headline (coupon shows here automatically)"
              onChange={(e) => onPatch({ subline: e.target.value || undefined } as Partial<Block>)}
            />
          </Field>
          <Field label="What it does">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPatch({ style: "form" } as Partial<Block>)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${block.style === "form" ? "border-white text-white" : "border-white/15 text-white/60"}`}
              >
                Opens quote form
              </button>
              <button
                type="button"
                onClick={() => onPatch({ style: "link" } as Partial<Block>)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${block.style === "link" ? "border-white text-white" : "border-white/15 text-white/60"}`}
              >
                Opens booking link
              </button>
            </div>
          </Field>
        </div>
      );
    case "action_row":
      return (
        <div className="space-y-2">
          {(
            [
              ["call", "Call button"],
              ["text", "Text button"],
              ["save", "Save to contacts"],
              ["share", "Share button"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-white/80">{label}</span>
              <Toggle checked={block[key]} onChange={(v) => onPatch({ [key]: v } as Partial<Block>)} />
            </div>
          ))}
          <Field label="Share message">
            <TextInput
              value={block.shareText ?? ""}
              placeholder="Get $20 off with …!"
              onChange={(e) => onPatch({ shareText: e.target.value || undefined } as Partial<Block>)}
            />
          </Field>
        </div>
      );
    case "review_cta":
      return (
        <Field label="Button text" hint="Set your Google review link in Business Info">
          <TextInput value={block.text} onChange={(e) => onPatch({ text: e.target.value } as Partial<Block>)} />
        </Field>
      );
    case "coupon":
      return (
        <div className="space-y-3">
          <Field label="Headline">
            <TextInput value={block.headline} onChange={(e) => onPatch({ headline: e.target.value } as Partial<Block>)} />
          </Field>
          <Field label="Subline" hint="Coupon code itself is set in Business Info">
            <TextInput
              value={block.subline ?? ""}
              onChange={(e) => onPatch({ subline: e.target.value || undefined } as Partial<Block>)}
            />
          </Field>
        </div>
      );
    case "service_areas":
      return <p className="text-xs text-white/50">Edits from “Service areas” in Business Info.</p>;
    case "gallery":
      return (
        <div className="space-y-3">
          <Field label="Title">
            <TextInput value={block.title} onChange={(e) => onPatch({ title: e.target.value } as Partial<Block>)} />
          </Field>
          <Field label="Image URLs" hint="One per line (photo uploads arrive with your dashboard)">
            <textarea
              rows={4}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
              value={block.images.map((im) => im.url).join("\n")}
              onChange={(e) =>
                onPatch({
                  images: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter((s) => /^https?:\/\//.test(s))
                    .slice(0, 12)
                    .map((url) => ({ url })),
                } as Partial<Block>)
              }
            />
          </Field>
        </div>
      );
    case "hours":
      return (
        <Field label="Hours" hint="One line each, like: Mon–Fri, 8am–6pm">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            value={block.rows.map((r) => `${r.day}, ${r.hours}`).join("\n")}
            onChange={(e) =>
              onPatch({
                rows: e.target.value
                  .split("\n")
                  .map((line) => {
                    const [day, ...rest] = line.split(",");
                    return { day: (day ?? "").trim().slice(0, 20), hours: rest.join(",").trim().slice(0, 40) };
                  })
                  .filter((r) => r.day)
                  .slice(0, 8),
              } as Partial<Block>)
            }
          />
        </Field>
      );
    case "socials":
      return (
        <Field label="Social links" hint="One per line: platform URL (facebook, instagram, tiktok, youtube, x, linkedin, google, yelp, nextdoor)">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            defaultValue={block.links.map((l) => `${l.kind} ${l.url}`).join("\n")}
            onBlur={(e) =>
              onPatch({
                links: e.target.value
                  .split("\n")
                  .map((line) => {
                    const [kind, url] = line.trim().split(/\s+/);
                    return { kind, url };
                  })
                  .filter(
                    (l) =>
                      ["facebook", "instagram", "tiktok", "youtube", "x", "linkedin", "google", "yelp", "nextdoor"].includes(l.kind) &&
                      /^https?:\/\//.test(l.url ?? "")
                  )
                  .slice(0, 9),
              } as Partial<Block>)
            }
          />
        </Field>
      );
    case "custom_links":
      return (
        <Field label="Links" hint="One per line: Label | https://url (optional emoji first)">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            defaultValue={block.links.map((l) => `${l.emoji ? l.emoji + " " : ""}${l.label} | ${l.url}`).join("\n")}
            onBlur={(e) =>
              onPatch({
                links: e.target.value
                  .split("\n")
                  .map((line) => {
                    const [left, url] = line.split("|").map((s) => s.trim());
                    if (!left || !/^https?:\/\//.test(url ?? "")) return null;
                    // Treat a leading non-alphanumeric token as an emoji
                    const m = left.match(/^(\S{1,4})\s+(.+)$/);
                    const isEmoji = m && !/^[a-zA-Z0-9]/.test(m[1]);
                    return isEmoji
                      ? { emoji: m![1], label: m![2].slice(0, 48), url }
                      : { label: left.slice(0, 48), url };
                  })
                  .filter((x): x is NonNullable<typeof x> => Boolean(x))
                  .slice(0, 8),
              } as Partial<Block>)
            }
          />
        </Field>
      );
    case "lead_form":
      return (
        <div className="space-y-3">
          <Field label="Headline">
            <TextInput value={block.headline} onChange={(e) => onPatch({ headline: e.target.value } as Partial<Block>)} />
          </Field>
          <Field label="Button text">
            <TextInput value={block.buttonText} onChange={(e) => onPatch({ buttonText: e.target.value } as Partial<Block>)} />
          </Field>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Ask for address</span>
            <Toggle checked={block.askAddress} onChange={(v) => onPatch({ askAddress: v } as Partial<Block>)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Ask what service they need</span>
            <Toggle checked={block.askService} onChange={(v) => onPatch({ askService: v } as Partial<Block>)} />
          </div>
          {block.askService ? (
            <Field label="Service options" hint="Comma-separated">
              <TextInput
                value={block.serviceOptions.join(", ")}
                placeholder="Carpet cleaning, Upholstery, Tile & grout"
                onChange={(e) =>
                  onPatch({
                    serviceOptions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10),
                  } as Partial<Block>)
                }
              />
            </Field>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}
