"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "How It Works", href: "/how-it-works" },
  {
    name: "Channels",
    href: "/channels",
    children: [
      { name: "Vehicle QR", href: "/channels/vehicle" },
      { name: "Job Site Signs", href: "/channels/job-site" },
      { name: "Partner Locations", href: "/channels/partner" },
      { name: "Smart Cards", href: "/channels/handout" },
    ],
  },
  {
    name: "Industries",
    href: "/industries",
    children: [
      { name: "Roofing", href: "/industries/roofing" },
      { name: "HVAC", href: "/industries/hvac" },
      { name: "Plumbing", href: "/industries/plumbing" },
      { name: "Carpet Cleaning", href: "/industries/carpet-cleaning" },
      { name: "House Cleaning", href: "/industries/house-cleaning" },
      { name: "Landscaping", href: "/industries/landscaping" },
      { name: "More...", href: "/industries" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo-horizontal.png" 
              alt="Tapzilla" 
              className="h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.name)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="text-neutral-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.children && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>
                {item.children && openDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2 min-w-48">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Log In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-2 text-neutral-500 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-100">
              <Link
                href="/auth/login"
                className="text-center py-2 text-neutral-600 font-medium"
              >
                Log In
              </Link>
              <Link href="/auth/signup" className="btn-primary text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
