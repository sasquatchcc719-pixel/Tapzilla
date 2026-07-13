import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tapzilla — The Business Card That Books Jobs",
  description:
    "Smart NFC business cards and magnets with a hosted page that captures leads and tracks every tap.",
  openGraph: {
    title: "Tapzilla — The Business Card That Books Jobs",
    description:
      "Smart NFC business cards and magnets with a hosted page that captures leads and tracks every tap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-black text-white relative`}
      >
        {children}
      </body>
    </html>
  );
}
