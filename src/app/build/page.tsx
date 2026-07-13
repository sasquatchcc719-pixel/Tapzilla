"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Block, PageConfig } from "@/lib/page-config/schema";
import { defaultPageConfig, safeParsePageConfig } from "@/lib/page-config/schema";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { PhonePreview } from "@/components/builder/PhonePreview";
import { BusinessForm } from "@/components/builder/BusinessForm";
import { ThemeForm } from "@/components/builder/ThemeForm";
import { BlocksEditor } from "@/components/builder/BlocksEditor";
import { BuilderChat } from "@/components/builder/BuilderChat";
import { CardPreview } from "@/components/builder/CardPreview";
import { TextInput } from "@/components/builder/fields";
import type { CardTemplateId } from "@/lib/card-templates";

const DRAFT_KEY = "tz_draft_v1";

type Draft = {
  config: PageConfig;
  pageId?: string;
  slug?: string;
  cardTemplateId?: CardTemplateId;
};

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const parsed = safeParsePageConfig(d.config);
    return parsed.success
      ? { config: parsed.data, pageId: d.pageId, slug: d.slug, cardTemplateId: d.cardTemplateId }
      : null;
  } catch {
    return null;
  }
}

export default function BuildPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"ai" | "info" | "blocks" | "design">("ai");
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");
  const [previewMode, setPreviewMode] = useState<"phone" | "card">("phone");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");

  // Load local draft, then prefer the server copy if signed in
  useEffect(() => {
    const local = loadDraft();
    if (local) setDraft(local);
    fetch("/api/pages")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.page) {
          const parsed = safeParsePageConfig(d.page.config);
          if (parsed.success) {
            setDraft({ config: parsed.data, pageId: d.page.pageId, slug: d.page.slug });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Persist locally on every change
  useEffect(() => {
    if (!draft) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const setConfig = (config: PageConfig) => setDraft((d) => ({ ...(d ?? {}), config }));

  const save = async (publish: boolean) => {
    if (!draft) return;
    setSaving(true);
    setNotice(null);
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: draft.config,
        pageId: draft.pageId,
        publish,
        cardTemplateId: draft.cardTemplateId ?? "voltage",
      }),
    }).catch(() => null);
    setSaving(false);

    if (!res) return setNotice("Network error — try again.");
    if (res.status === 401) {
      window.location.href = `/auth/login?next=${encodeURIComponent("/build")}`;
      return;
    }
    const d = await res.json();
    if (!res.ok) return setNotice(d.error === "invalid config" ? "Something in the page isn't valid — check your links." : "Save failed — try again.");
    setDraft((prev) => (prev ? { ...prev, pageId: d.pageId, slug: d.slug } : prev));
    setNotice(publish ? `Published! Your page is live at /p/${d.slug}` : "Draft saved.");
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/60">
        Loading…
      </div>
    );
  }

  /* ── Template picker (first run) ──────────────────────────────────────── */
  if (!draft) {
    return (
      <div className="min-h-screen bg-black px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <Image src="/Tapzilla.svg" alt="Tapzilla" width={220} height={72} className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="text-3xl font-black text-white">Build your smart card page</h1>
            <p className="mt-2 text-white/60">
              Pick a starting point — everything is changeable, and you&apos;ll see it live as you type.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-md">
            <TextInput
              value={nameInput}
              placeholder="Your business name"
              className="py-3 text-center text-lg"
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>

          <button
            type="button"
            disabled={!nameInput.trim()}
            onClick={() => {
              setDraft({ config: defaultPageConfig(nameInput.trim()) });
              setTab("ai");
            }}
            className="mx-auto mb-8 block w-full max-w-md rounded-2xl border border-primary-400/60 bg-primary-500/10 p-5 text-center transition-colors hover:bg-primary-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <p className="text-lg font-bold text-primary-300">✨ Build it for me</p>
            <p className="mt-1 text-sm text-white/60">
              Chat with our AI — describe your business or paste your website, watch your page appear.
            </p>
          </button>

          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
            or start from a template
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={!nameInput.trim()}
                onClick={() => {
                  const config = getTemplate(t.id)!.build(nameInput.trim());
                  setDraft({ config });
                  setTab("info");
                }}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition-colors hover:border-primary-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <p className="text-lg font-bold text-white">{t.name}</p>
                <p className="mt-1 text-sm text-white/60">{t.description}</p>
              </button>
            ))}
          </div>
          {!nameInput.trim() ? (
            <p className="mt-4 text-center text-sm text-white/40">Type your business name to get started</p>
          ) : null}
        </div>
      </div>
    );
  }

  /* ── Editor ───────────────────────────────────────────────────────────── */
  const config = draft.config;
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Tapzilla.svg" alt="Tapzilla" width={110} height={36} className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {notice ? <span className="hidden text-xs text-primary-300 sm:inline">{notice}</span> : null}
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="rounded-lg bg-primary-500 px-4 py-1.5 text-sm font-bold text-black hover:bg-primary-400 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </header>
      {notice ? <p className="bg-primary-500/10 px-4 py-1.5 text-center text-xs text-primary-300 sm:hidden">{notice}</p> : null}

      {/* Mobile pane switch */}
      <div className="flex border-b border-white/10 bg-black lg:hidden">
        {(["edit", "preview"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setMobilePane(p)}
            className={`flex-1 py-2 text-sm font-semibold capitalize ${
              mobilePane === p ? "border-b-2 border-primary-400 text-white" : "text-white/50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: editor panel */}
        <div
          className={`w-full flex-col border-r border-white/10 bg-neutral-950 lg:flex lg:w-[400px] ${
            mobilePane === "edit" ? "flex" : "hidden"
          }`}
        >
          <div className="flex border-b border-white/10 bg-neutral-950">
            {(
              [
                ["ai", "✨ AI"],
                ["info", "Info"],
                ["blocks", "Sections"],
                ["design", "Design"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-1 py-2.5 text-sm font-semibold ${
                  tab === key ? "border-b-2 border-primary-400 text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "ai" ? (
            <div className="min-h-0 flex-1">
              <BuilderChat config={config} onConfig={(c) => setConfig(c)} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              {tab === "info" ? (
                <BusinessForm
                  config={config}
                  onChange={(patch) =>
                    setConfig({ ...config, business: { ...config.business, ...patch } })
                  }
                />
              ) : tab === "blocks" ? (
                <BlocksEditor config={config} onChange={(blocks: Block[]) => setConfig({ ...config, blocks })} />
              ) : (
                <ThemeForm
                  config={config}
                  onChange={(patch) => setConfig({ ...config, theme: { ...config.theme, ...patch } })}
                />
              )}
            </div>
          )}
        </div>

        {/* Right: live preview (phone page or physical card) */}
        <div
          className={`flex-1 flex-col items-center overflow-y-auto bg-neutral-900/60 p-6 lg:flex ${
            mobilePane === "preview" ? "flex" : "hidden"
          }`}
        >
          <div className="mb-5 flex rounded-full border border-white/15 p-1">
            {(
              [
                ["phone", "📱 Your page"],
                ["card", "💳 Your card"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreviewMode(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  previewMode === key ? "bg-primary-500 text-black" : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {previewMode === "phone" ? (
            <PhonePreview config={config} />
          ) : (
            <CardPreview
              config={config}
              slug={draft.slug}
              templateId={draft.cardTemplateId ?? "voltage"}
              onTemplate={(t) => setDraft((d) => (d ? { ...d, cardTemplateId: t } : d))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
