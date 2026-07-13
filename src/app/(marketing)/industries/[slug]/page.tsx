import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries, getIndustryBySlug, getAllIndustrySlugs } from "@/lib/industries";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) return { title: "Industry Not Found" };

  return {
    title: `${industry.name} Lead Generation - Tapzilla`,
    description: `${industry.name} leads for $${industry.pricePerLead} each. Qualified prospects delivered to you, ready to book.`,
  };
}

const tierColors: Record<string, string> = {
  Premium: "from-amber-500 to-orange-500",
  Standard: "from-primary-500 to-primary-700",
  Basic: "from-emerald-500 to-teal-500",
  Starter: "from-blue-500 to-indigo-500",
};

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustryBySlug(params.slug);

  if (!industry) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Link href="/industries" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Industries
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {industry.name} Leads for{" "}
                <span className="gradient-text">${industry.pricePerLead} Each</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-6">
                {industry.description}
              </p>
              <div className={`inline-block bg-gradient-to-r ${tierColors[industry.tier]} text-white font-semibold px-4 py-2 rounded-full mb-6`}>
                {industry.tier} Tier - ${industry.pricePerLead}/lead
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                  Start Getting {industry.name} Leads
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-[12rem]">{industry.icon}</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              The {industry.name} Lead Problem
            </h2>
            <ul className="space-y-4">
              {industry.problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-500/20 text-accent-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg text-neutral-300">{problem}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How Tapzilla Works for This Industry */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How Tapzilla Works for {industry.name}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">Customer Scans</h3>
              <p className="text-neutral-600">They see your QR code and scan it with their phone</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">AI Qualifies</h3>
              <p className="text-neutral-600">
                Your AI knows {industry.name.toLowerCase()} - asks about {industry.exampleConversation.service}
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">You Get the Lead</h3>
              <p className="text-neutral-600">Name, phone, and exactly what they need - delivered instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Conversation */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Your AI Knows {industry.name}
            </h2>
            <p className="text-lg text-neutral-600">
              Trained on your industry's terminology and common questions
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-primary-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{industry.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold">Your {industry.name} Business</h3>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-neutral-50">
              <div className="chat-bubble-bot">
                <p className="text-sm">
                  Hey! Looking for {industry.exampleConversation.service}? I can help you get a quote in about 60 seconds.
                </p>
              </div>
              {industry.exampleConversation.questions.slice(0, 2).map((q, i) => (
                <div key={i}>
                  <div className="chat-bubble-bot">
                    <p className="text-sm">{q}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="chat-bubble-user">
                      <p className="text-sm">[Customer responds]</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="chat-bubble-bot">
                <p className="text-sm">
                  Great! What's the best phone number to reach you?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where to Put QR Codes */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Where to Put Your QR Codes
            </h2>
            <p className="text-lg text-neutral-600">
              Best placements for {industry.name.toLowerCase()} businesses
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {industry.qrPlacements.map((placement, i) => (
              <div key={i} className="card flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-neutral-700">{placement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Compare to Other Lead Sources
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-neutral-100 font-semibold text-sm">
                <div className="p-4">Source</div>
                <div className="p-4 text-center">Cost Per Lead</div>
                <div className="p-4 text-center">Lead Quality</div>
              </div>
              {[
                { source: "Thumbtack", cost: "$30-100", quality: "Shared with competitors" },
                { source: "HomeAdvisor", cost: "$25-75", quality: "Sent to 3-5 businesses" },
                { source: "Google Ads", cost: "$50-150", quality: "Clicks, not leads" },
                { source: "Tapzilla", cost: `$${industry.pricePerLead}`, quality: "Exclusive, pre-qualified", highlight: true },
              ].map((row) => (
                <div key={row.source} className={`grid grid-cols-3 border-t border-neutral-100 ${row.highlight ? "bg-primary-50" : ""}`}>
                  <div className={`p-4 font-medium ${row.highlight ? "text-primary-700" : "text-neutral-700"}`}>
                    {row.source}
                  </div>
                  <div className={`p-4 text-center ${row.highlight ? "text-primary-700 font-bold text-xl" : "text-neutral-600"}`}>
                    {row.cost}
                  </div>
                  <div className={`p-4 text-center text-sm ${row.highlight ? "text-primary-700" : "text-neutral-600"}`}>
                    {row.quality}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get {industry.name} Leads?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            ${industry.pricePerLead} per qualified lead. $99 setup. No contracts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start Getting {industry.name} Leads
            </Link>
            <Link href="/pricing" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Other Industries */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Other Industries We Serve
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {industries
              .filter((i) => i.slug !== industry.slug)
              .slice(0, 6)
              .map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="card flex items-center gap-3 hover:border-primary-500 transition-colors"
                >
                  <span className="text-2xl">{ind.icon}</span>
                  <span className="font-medium text-neutral-700">{ind.name}</span>
                </Link>
              ))}
            <Link
              href="/industries"
              className="card flex items-center gap-3 hover:border-primary-500 transition-colors"
            >
              <span className="text-neutral-500">View All</span>
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
