import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Background circuits overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none animate-background-drift"
        style={{
          backgroundImage: "url(/background-circuits.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.25,
        }}
      />
      <div className="relative z-10">
        <Header />
        <main className="pt-16 md:pt-20 bg-transparent">{children}</main>
        <Footer />
      </div>
    </>
  );
}
