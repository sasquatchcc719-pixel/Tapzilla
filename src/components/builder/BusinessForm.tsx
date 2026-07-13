"use client";

import type { PageConfig } from "@/lib/page-config/schema";
import { Field, TextInput, TextArea } from "./fields";

export function BusinessForm({
  config,
  onChange,
}: {
  config: PageConfig;
  onChange: (patch: Partial<PageConfig["business"]>) => void;
}) {
  const b = config.business;
  return (
    <div className="space-y-4">
      <Field label="Business name">
        <TextInput value={b.name} onChange={(e) => onChange({ name: e.target.value })} />
      </Field>
      <Field label="Tagline" hint="One short line under your name">
        <TextInput
          value={b.tagline ?? ""}
          placeholder="Colorado's friendliest carpet cleaners"
          onChange={(e) => onChange({ tagline: e.target.value || undefined })}
        />
      </Field>
      <Field label="Phone">
        <TextInput
          value={b.phone ?? ""}
          placeholder="(719) 555-0142"
          onChange={(e) => onChange({ phone: e.target.value || undefined })}
        />
      </Field>
      <Field label="Text message starter" hint="Pre-filled when someone taps 'Text Us'">
        <TextArea
          rows={2}
          value={b.smsBody ?? ""}
          placeholder="Hi! I tapped your card and I'm interested in…"
          onChange={(e) => onChange({ smsBody: e.target.value || undefined })}
        />
      </Field>
      <Field label="Email">
        <TextInput
          type="email"
          value={b.email ?? ""}
          onChange={(e) => onChange({ email: e.target.value || undefined })}
        />
      </Field>
      <Field label="Website">
        <TextInput
          type="url"
          value={b.website ?? ""}
          placeholder="https://…"
          onChange={(e) => onChange({ website: e.target.value || undefined })}
        />
      </Field>
      <Field label="Google review link" hint="From your Google Business Profile → 'Ask for reviews'">
        <TextInput
          type="url"
          value={b.reviewUrl ?? ""}
          placeholder="https://g.page/r/…"
          onChange={(e) => onChange({ reviewUrl: e.target.value || undefined })}
        />
      </Field>
      <Field label="Online booking link" hint="Calendly, Housecall Pro, Square… (optional)">
        <TextInput
          type="url"
          value={b.bookingUrl ?? ""}
          placeholder="https://…"
          onChange={(e) => onChange({ bookingUrl: e.target.value || undefined })}
        />
      </Field>
      <Field label="Service areas" hint="Comma-separated towns/neighborhoods">
        <TextInput
          value={b.serviceAreas.join(", ")}
          placeholder="Monument, Colorado Springs, Castle Rock"
          onChange={(e) =>
            onChange({
              serviceAreas: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 12),
            })
          }
        />
      </Field>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/60">
          Coupon (powerful — give people a reason to keep the card)
        </p>
        <div className="space-y-2">
          <Field label="Code">
            <TextInput
              value={b.coupon?.code ?? ""}
              placeholder="TAP20"
              onChange={(e) => {
                const code = e.target.value.toUpperCase().slice(0, 24);
                onChange({
                  coupon: code
                    ? { code, label: b.coupon?.label ?? "saves you $20 — mention it when booking" }
                    : undefined,
                });
              }}
            />
          </Field>
          <Field label="What it gets them">
            <TextInput
              value={b.coupon?.label ?? ""}
              placeholder="saves you $20 — mention it when booking"
              disabled={!b.coupon}
              onChange={(e) =>
                b.coupon && onChange({ coupon: { code: b.coupon.code, label: e.target.value } })
              }
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
