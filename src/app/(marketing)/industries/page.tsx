import Link from "next/link";
import { Metadata } from "next";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries - Tapzilla",
  description:
    "AI-powered lead generation for home service businesses. Roofing, HVAC, plumbing, carpet cleaning, and more.",
};

const tierColors: Record<string, string> = {
  Premium: "from-amber-500 to-orange-500",
  Standard: "from-primary-500 to-primary-700",
  Basic: "from-emerald-500 to-teal-500",
  Starter: "from-blue-500 to-indigo-500",
};

export default function IndustriesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Built for <span className="gradient-text">Your Industry</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            AI trained specifically for home service businesses. Your chatbot knows 
            your industry's terminology, common questions, and pricing structures.
          </p>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="card group hover:border-primary-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{industry.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {industry.name}
                      </h3>
                    </div>
                    <div className={`inline-block bg-gradient-to-r ${tierColors[industry.tier]} text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2`}>
                      ${industry.pricePerLead}/lead
                    </div>
                    <p className="text-neutral-600 text-sm mb-3">{industry.description}</p>
                    <span className="text-primary-600 font-medium inline-flex items-center gap-1 text-sm">
                      Learn More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing by Tier */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Pricing by Industry
            </h2>
            <p className="text-lg text-neutral-600">
              Your price reflects your industry's average job value
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { tier: "Premium", price: 10, examples: "Roofing, HVAC" },
              { tier: "Standard", price: 5, examples: "Plumbing, Electrical" },
              { tier: "Basic", price: 2, examples: "Cleaning, Landscaping" },
              { tier: "Starter", price: 1, examples: "Detailing, Grooming" },
            ].map((item) => (
              <div key={item.tier} className="card text-center">
                <div className={`inline-block bg-gradient-to-r ${tierColors[item.tier]} text-white text-sm font-semibold px-3 py-1 rounded-full mb-4`}>
                  {item.tier}
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2">
                  ${item.price}
                  <span className="text-lg font-normal text-neutral-500">/lead</span>
                </div>
                <p className="text-neutral-600 text-sm">{item.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See Your Industry */}
      <section className="section">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Don't See Your Industry?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            We work with all types of service businesses. Let's talk about your specific needs.
          </p>
          <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
            Contact Us
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            $99 setup, then pay only for qualified leads
          </p>
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Start Getting Leads
          </Link>
        </div>
      </section>
    </div>
  );
}
