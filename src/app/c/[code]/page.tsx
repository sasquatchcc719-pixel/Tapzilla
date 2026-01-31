import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import { Metadata } from "next";

interface PageProps {
  params: { code: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  
  const { data: qrCode } = await supabase
    .from("qr_codes")
    .select("companies(name, tagline)")
    .eq("code", params.code)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const company = (qrCode?.companies as any) as { name: string; tagline: string } | null;

  return {
    title: company?.name || "Chat",
    description: company?.tagline || "Get a quote in 60 seconds",
  };
}

export default async function ChatbotPage({ params }: PageProps) {
  const supabase = await createClient();

  // Get QR code and company data
  const { data: qrCode, error } = await supabase
    .from("qr_codes")
    .select(`
      *,
      companies (
        *,
        industries (*)
      )
    `)
    .eq("code", params.code)
    .eq("status", "active")
    .single();

  if (error || !qrCode) {
    notFound();
  }

  const company = qrCode.companies as {
    id: string;
    name: string;
    tagline: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    chatbot_tone: string;
    chatbot_greeting: string;
    show_pricing: boolean;
    require_email: boolean;
    website: string;
    industries: { name: string } | null;
  };

  // Get services and FAQs for chatbot
  const [servicesResult, faqsResult] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("company_id", company.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("company_faqs")
      .select("*")
      .eq("company_id", company.id)
      .order("sort_order"),
  ]);

  const services = servicesResult.data || [];
  const faqs = faqsResult.data || [];

  // Record the scan (fire and forget)
  supabase
    .from("scans")
    .insert({
      qr_code_id: qrCode.id,
      company_id: company.id,
    })
    .then(() => {
      // Update QR code stats
      supabase
        .from("qr_codes")
        .update({
          total_scans: (qrCode.total_scans || 0) + 1,
          last_scan_at: new Date().toISOString(),
        })
        .eq("id", qrCode.id);
    });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: company.secondary_color || "#1a1a1a" }}
    >
      {/* Header */}
      <header className="p-4 text-center bg-white/10 backdrop-blur-sm">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt={company.name}
            className="h-12 mx-auto mb-2 object-contain"
          />
        )}
        <h1
          className="text-xl font-bold"
          style={{ color: company.primary_color || "#FF6B00" }}
        >
          {company.name}
        </h1>
        {company.tagline && (
          <p className="text-sm text-gray-300">{company.tagline}</p>
        )}
      </header>

      {/* Chat */}
      <main className="flex-1 p-4 flex items-start justify-center">
        <ChatWindow
          company={company}
          services={services}
          faqs={faqs}
          qrCodeId={qrCode.id}
        />
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500">
        <a href="https://tapzilla.com" className="hover:text-gray-300">
          Powered by Tapzilla
        </a>
      </footer>
    </div>
  );
}
