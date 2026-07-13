"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { name: "How it works", href: "/#how" },
  { name: "Pricing", href: "/pricing" },
  { name: "Live demo", href: "/p/summit-carpet-care" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/Tapzilla.svg"
              alt="Tapzilla"
              width={150}
              height={48}
              className="tz-logo-blend h-10 w-auto md:h-12"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium text-white/80 transition-colors hover:text-primary-400"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/dashboard"
              className="font-medium text-white/80 transition-colors hover:text-primary-400"
            >
              Dashboard
            </Link>
            <Link
              href="/build"
              className="tz-glow-btn rounded-xl bg-primary-500 px-5 py-2.5 font-bold text-black transition-transform hover:scale-[1.03]"
            >
              Build yours
            </Link>
          </div>

          <button
            className="p-2 text-white md:hidden"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2.5 font-medium text-white/85"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="block py-2.5 font-medium text-white/85"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/build"
              className="mt-3 block rounded-xl bg-primary-500 py-3 text-center font-bold text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Build yours
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
