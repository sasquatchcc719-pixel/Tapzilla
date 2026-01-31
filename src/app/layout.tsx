import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  title: "Tapzilla - An AI Salesperson Behind Every QR Code",
  description:
    "Turn every QR code scan into a conversation that captures qualified leads. Our AI chatbot qualifies prospects, answers questions, and delivers ready-to-close leads to your business.",
  keywords: [
    "QR code lead generation",
    "AI chatbot",
    "lead qualification",
    "service business leads",
    "QR code marketing",
  ],
  openGraph: {
    title: "Tapzilla - An AI Salesperson Behind Every QR Code",
    description:
      "Turn every QR code scan into a conversation that captures qualified leads automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-black text-white relative`}
      >
        {/* Background circuits overlay */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none animate-background-drift"
          style={{
            backgroundImage: 'url(/background-circuits.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
          }}
        />
        <div className="relative z-10">
          <Header />
          <main className="pt-16 md:pt-20 bg-transparent">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
