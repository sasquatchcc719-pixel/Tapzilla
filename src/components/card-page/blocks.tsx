"use client";

import { useState } from "react";
import type { Block, BusinessInfo, PageConfig } from "@/lib/page-config/schema";
import { useTrack } from "./Tracker";
import { usePageMeta } from "./meta";

/* Shared bits ---------------------------------------------------------- */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-black/60 backdrop-blur-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

/* Blocks ---------------------------------------------------------------- */

export function HeroCard({
  block,
  business,
}: {
  block: Extract<Block, { type: "hero_card" }>;
  business: BusinessInfo;
}) {
  if (block.imageUrl) {
    return (
      <div className="mb-5 overflow-hidden rounded-2xl shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.imageUrl} alt={`${business.name} card`} className="w-full" />
      </div>
    );
  }
  // No photo: render a generated hero from business identity
  return (
    <div
      className="mb-5 rounded-2xl p-6 text-center shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--tz-primary) 25%, #000), #000 70%)",
        border: "1px solid color-mix(in srgb, var(--tz-primary) 45%, transparent)",
      }}
    >
      {business.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={business.logoUrl} alt={business.name} className="mx-auto mb-3 h-20 w-auto object-contain" />
      ) : null}
      <h1 className="text-3xl font-black text-white">{business.name}</h1>
      {business.tagline ? <p className="mt-1 text-sm text-white/75">{business.tagline}</p> : null}
      {business.phone ? (
        <p className="mt-3 text-2xl font-extrabold tracking-wide" style={{ color: "var(--tz-primary)" }}>
          {business.phone}
        </p>
      ) : null}
    </div>
  );
}

export function CtaBooking({
  block,
  business,
}: {
  block: Extract<Block, { type: "cta_booking" }>;
  business: BusinessInfo;
}) {
  const track = useTrack();
  const [formOpen, setFormOpen] = useState(false);
  const asForm = block.style === "form";
  const href = !asForm ? business.bookingUrl : undefined;

  const inner = (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-7 text-center shadow-2xl transition-transform hover:scale-[1.02]"
      style={{ background: "linear-gradient(180deg, var(--tz-primary), color-mix(in srgb, var(--tz-primary) 55%, #000))" }}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-black/70">
        Tap below to get started
      </p>
      <p className="text-2xl font-black text-black drop-shadow-sm sm:text-3xl">{block.headline}</p>
      {business.coupon ? (
        <p className="mt-1 text-base font-bold text-black/80">
          {business.coupon.code} {business.coupon.label}
        </p>
      ) : block.subline ? (
        <p className="mt-1 text-base font-bold text-black/80">{block.subline}</p>
      ) : null}
    </div>
  );

  return (
    <div className="mb-3">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => track("button_click", { button: "booking" })}>
          {inner}
        </a>
      ) : (
        <button
          className="w-full"
          onClick={() => {
            setFormOpen((v) => !v);
            track("button_click", { button: asForm ? "lead_form_open" : "booking" });
          }}
        >
          {inner}
        </button>
      )}
      {asForm && formOpen ? <InlineLeadForm business={business} /> : null}
    </div>
  );
}

export function ActionRow({
  block,
  business,
  shareUrl,
}: {
  block: Extract<Block, { type: "action_row" }>;
  business: BusinessInfo;
  shareUrl: string;
}) {
  const track = useTrack();
  const meta = usePageMeta();
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const doShare = async () => {
    track("button_click", { button: "share" });
    const text = block.shareText ?? `Check out ${business.name}!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business.name, text, url: shareUrl });
        return;
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        flash("Link copied!");
      } catch {
        flash(shareUrl);
      }
    }
  };

  const btn =
    "flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 text-base font-semibold transition-colors";

  return (
    <div className="mb-5 space-y-2.5">
      {block.call && business.phone ? (
        <a
          href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
          onClick={() => track("button_click", { button: "call" })}
          className={`${btn} border-transparent text-white`}
          style={{ background: "#2563eb" }}
        >
          📞 Call: {business.phone}
        </a>
      ) : null}
      {block.text && business.phone ? (
        <a
          href={`sms:${business.phone.replace(/[^+\d]/g, "")}${
            business.smsBody ? `?body=${encodeURIComponent(business.smsBody)}` : ""
          }`}
          onClick={() => track("button_click", { button: "text" })}
          className={`${btn} border-white/25 text-white hover:bg-white/10`}
        >
          💬 Text Us
        </a>
      ) : null}
      {block.save ? (
        <a
          href={`/api/vcard/${encodeURIComponent(meta.slug)}`}
          onClick={() => track("button_click", { button: "save_contact" })}
          className={`${btn} border-white/25 text-white hover:bg-white/10`}
        >
          👤 Save to Contacts
        </a>
      ) : null}
      {block.share ? (
        <button
          onClick={doShare}
          className={`${btn} text-white hover:bg-white/10`}
          style={{ borderColor: "var(--tz-primary)", color: "var(--tz-primary)" }}
        >
          🔗 Share
        </button>
      ) : null}
      {toast ? (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xl">
          ✓ {toast}
        </div>
      ) : null}
    </div>
  );
}

export function ReviewCta({
  block,
  business,
}: {
  block: Extract<Block, { type: "review_cta" }>;
  business: BusinessInfo;
}) {
  const track = useTrack();
  if (!business.reviewUrl) return null;
  return (
    <a
      href={business.reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("button_click", { button: "review" })}
      className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-400 py-4 text-base font-semibold text-amber-400 hover:bg-amber-400/10"
    >
      ⭐ {block.text}
    </a>
  );
}

export function CouponBlock({
  block,
  business,
}: {
  block: Extract<Block, { type: "coupon" }>;
  business: BusinessInfo;
}) {
  const track = useTrack();
  const [copied, setCopied] = useState(false);
  if (!business.coupon) return null;
  return (
    <Panel className="mb-5 text-center" >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{block.headline}</p>
      <button
        className="mt-2 rounded-lg border-2 border-dashed px-6 py-2 text-2xl font-black tracking-widest"
        style={{ borderColor: "var(--tz-accent)", color: "var(--tz-accent)" }}
        onClick={async () => {
          track("coupon_copy", { code: business.coupon!.code });
          try {
            await navigator.clipboard.writeText(business.coupon!.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {}
        }}
      >
        {copied ? "COPIED ✓" : business.coupon.code}
      </button>
      <p className="mt-2 text-sm text-white/80">{block.subline ?? business.coupon.label}</p>
    </Panel>
  );
}

export function ServiceAreas({ business }: { business: BusinessInfo }) {
  if (!business.serviceAreas.length) return null;
  return (
    <Panel className="mb-5">
      <p className="text-sm text-white/85">
        📍 <span className="font-semibold">We serve:</span>{" "}
        {business.serviceAreas.join(" • ")}
      </p>
    </Panel>
  );
}

export function Gallery({ block }: { block: Extract<Block, { type: "gallery" }> }) {
  const track = useTrack();
  if (!block.images.length) return null;
  return (
    <div className="mb-5">
      <h3 className="mb-3 text-lg font-bold text-white">{block.title}</h3>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        onScroll={() => track("gallery_scroll")}
      >
        {block.images.map((img, i) => (
          <figure key={i} className="w-56 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.caption ?? ""} className="h-40 w-56 rounded-xl object-cover" />
            {img.caption ? <figcaption className="mt-1 text-xs text-white/60">{img.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Hours({ block }: { block: Extract<Block, { type: "hours" }> }) {
  if (!block.rows.length) return null;
  return (
    <Panel className="mb-5">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white/70">Hours</h3>
      <table className="w-full text-sm text-white/85">
        <tbody>
          {block.rows.map((r, i) => (
            <tr key={i}>
              <td className="py-0.5 pr-4 font-medium">{r.day}</td>
              <td className="py-0.5 text-right">{r.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  linkedin: "LinkedIn",
  google: "Google",
  yelp: "Yelp",
  nextdoor: "Nextdoor",
};

export function Socials({ block }: { block: Extract<Block, { type: "socials" }> }) {
  const track = useTrack();
  if (!block.links.length) return null;
  return (
    <div className="mb-5 flex flex-wrap justify-center gap-2">
      {block.links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("button_click", { button: "social", kind: l.kind })}
          className="rounded-full border border-white/25 px-4 py-1.5 text-sm text-white/85 hover:bg-white/10"
        >
          {SOCIAL_LABELS[l.kind] ?? l.kind}
        </a>
      ))}
    </div>
  );
}

export function CustomLinks({ block }: { block: Extract<Block, { type: "custom_links" }> }) {
  const track = useTrack();
  if (!block.links.length) return null;
  return (
    <div className="mb-5 space-y-2.5">
      {block.links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("button_click", { button: "custom_link", label: l.label })}
          className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-black/50 px-5 py-4 text-white hover:bg-white/10"
        >
          <span className="font-semibold">
            {l.emoji ? `${l.emoji} ` : ""}
            {l.label}
          </span>
          <span aria-hidden>›</span>
        </a>
      ))}
    </div>
  );
}

/* Lead form (used by cta_booking style=form and the lead_form block) ------ */

export function InlineLeadForm({
  business,
  block,
}: {
  business: BusinessInfo;
  block?: Extract<Block, { type: "lead_form" }>;
}) {
  const track = useTrack();
  const meta = usePageMeta();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);

  if (state === "done") {
    return (
      <Panel className="mt-3 text-center">
        <p className="text-lg font-bold text-white">✓ Request sent!</p>
        <p className="mt-1 text-sm text-white/75">
          {business.name} will get back to you shortly.
        </p>
      </Panel>
    );
  }

  return (
    <form
      className="mt-3 space-y-2.5 rounded-2xl border border-white/15 bg-black/70 p-4"
      onFocus={() => {
        if (!started) {
          setStarted(true);
          track("form_started");
        }
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const fd = new FormData(e.currentTarget);
        const body = {
          ...Object.fromEntries(fd.entries()),
          businessId: meta.businessId,
          pageId: meta.pageId,
        };
        track("form_submitted");
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch(() => null);
        setState(res?.ok ? "done" : "error");
      }}
    >
      {block?.headline ? (
        <p className="text-center text-lg font-bold text-white">{block.headline}</p>
      ) : null}
      <input name="name" required placeholder="Your name" className="tz-input" />
      <input name="phone" required placeholder="Phone number" type="tel" className="tz-input" />
      {block?.askAddress ? <input name="address" placeholder="Address" className="tz-input" /> : null}
      {block?.askService && block.serviceOptions.length ? (
        <select name="service" className="tz-input" defaultValue="">
          <option value="" disabled>
            What do you need?
          </option>
          {block.serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : null}
      <textarea name="message" placeholder="Tell us about the job…" rows={3} className="tz-input" />
      <label className="flex items-start gap-2 text-xs text-white/60">
        <input type="checkbox" name="smsConsent" value="true" className="mt-0.5" />
        It&apos;s OK to text me about my request
      </label>
      {state === "error" ? (
        <p className="text-sm text-red-400">Something went wrong — please try again.</p>
      ) : null}
      <button
        disabled={state === "sending"}
        className="w-full rounded-xl py-4 text-base font-bold text-black disabled:opacity-60"
        style={{ background: "var(--tz-primary)" }}
      >
        {state === "sending" ? "Sending…" : block?.buttonText ?? "Send Request"}
      </button>
    </form>
  );
}

export function LeadFormBlock({
  block,
  business,
}: {
  block: Extract<Block, { type: "lead_form" }>;
  business: BusinessInfo;
}) {
  return (
    <div className="mb-5">
      <InlineLeadForm business={business} block={block} />
    </div>
  );
}

export type { PageConfig };
