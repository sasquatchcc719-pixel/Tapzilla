import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TapEcho } from "@/components/marketing/TapEcho";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TapEcho />
      <div className="relative z-10">
        <Header />
        <main className="pt-16 md:pt-20 bg-transparent">{children}</main>
        <Footer />
      </div>
    </>
  );
}
