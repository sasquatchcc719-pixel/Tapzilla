import Link from "next/link";
import Image from "next/image";
import { TapEcho } from "@/components/marketing/TapEcho";

/** Shared dark shell for the auth pages — matches the platform, not v1. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <TapEcho />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/Tapzilla.svg"
              alt="Tapzilla"
              width={200}
              height={64}
              className="tz-logo-blend mx-auto h-14 w-auto"
            />
          </Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-neutral-950/90 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-center font-display text-2xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-center text-sm text-white/55">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/40 hover:text-white/70">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export const authInput =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary-400";
export const authButton =
  "w-full rounded-xl bg-primary-500 py-3.5 font-bold text-black transition-colors hover:bg-primary-400 disabled:opacity-50";
export const authLabel = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50";
