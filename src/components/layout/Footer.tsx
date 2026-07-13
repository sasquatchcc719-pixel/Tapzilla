import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "Build your card", href: "/build" },
    { name: "Pricing", href: "/pricing" },
    { name: "Live demo", href: "/p/summit-carpet-care" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 text-white">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/Tapzilla.svg"
                alt="Tapzilla"
                width={140}
                height={44}
                className="tz-logo-blend h-10 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm text-white/60">
              The business card that books jobs. NFC cards + a page that captures
              leads + analytics that talk in dollars.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-primary-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-primary-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
          © {new Date().getFullYear()} Tapzilla. Built in Colorado by a carpet cleaner
          who wanted better business cards.
        </div>
      </div>
    </footer>
  );
}
