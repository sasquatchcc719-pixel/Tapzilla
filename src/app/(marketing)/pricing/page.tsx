import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Tapzilla",
  description:
    "Pay per qualified lead. No monthly fees, no contracts. See transparent pricing for all industries.",
};

const pricingTiers = [
  {
    tier: "Premium",
    price: 10,
    industries: ["Roofing", "HVAC", "Water Restoration", "Solar"],
    color: "from-amber-500 to-orange-500",
    description: "High-ticket services with significant job values",
  },
  {
    tier: "Standard",
    price: 5,
    industries: ["Plumbing", "Electrical", "Painting", "General Contractors"],
    color: "from-primary-500 to-primary-700",
    description: "Essential home services with moderate job values",
    popular: true,
  },
  {
    tier: "Basic",
    price: 2,
    industries: ["Carpet Cleaning", "House Cleaning", "Landscaping", "Pest Control"],
    color: "from-emerald-500 to-teal-500",
    description: "Recurring services with steady demand",
  },
  {
    tier: "Starter",
    price: 1,
    industries: ["Pet Grooming", "Auto Detailing", "Small Services"],
    color: "from-blue-500 to-indigo-500",
    description: "Lower-ticket services and specialty businesses",
  },
];

const included = [
  { icon: "🎨", title: "Custom branded landing page", description: "Your logo, colors, and business info" },
  { icon: "🤖", title: "AI chatbot trained on YOUR business", description: "Knows your services, pricing, and FAQs" },
  { icon: "📱", title: "Unlimited QR codes", description: "Create as many as you need" },
  { icon: "👁️", title: "Unlimited scans", description: "Scans are free - you only pay for leads" },
  { icon: "📧", title: "Lead delivery via email", description: "Instant notifications when leads come in" },
  { icon: "📊", title: "Dashboard access", description: "Track all your leads and conversations" },
  { icon: "🏥", title: "Placard health monitoring", description: "Alerts if your placards stop working" },
  { icon: "📝", title: "Conversation transcripts", description: "See exactly what was discussed" },
];

const addons = [
  { name: "SMS Alerts", price: 25, unit: "/mo", description: "Instant text when leads come in" },
  { name: "CRM Integration", price: 25, unit: "/mo", description: "Push to Jobber, ServiceTitan, HubSpot, etc." },
  { name: "Advanced Analytics", price: 25, unit: "/mo", description: "Conversion funnels, time analysis, comparisons" },
  { name: "White Label", price: 100, unit: "/mo", description: "Remove 'Powered by Tapzilla'" },
  { name: "Priority Support", price: 50, unit: "/mo", description: "Phone support, faster response" },
];

const comparison = [
  { source: "Thumbtack", cost: "$30-100", quality: "Cold, competing quotes" },
  { source: "HomeAdvisor", cost: "$25-75", quality: "Cold, competing quotes" },
  { source: "Google Ads", cost: "$50-150", quality: "Cold, clicks not leads" },
  { source: "Tapzilla", cost: "$1-10", quality: "Warm, pre-qualified, exclusive", highlight: true },
];

const faqs = [
  {
    question: "What if the lead is bad?",
    answer: "Full conversation transcript included. If someone gave fake info or wasn't actually interested, contact us for review. We'll credit obvious bad leads.",
  },
  {
    question: "When do I get charged?",
    answer: "Leads are billed at the end of each month. You'll see every lead in your dashboard before you're charged.",
  },
  {
    question: "Is there a minimum?",
    answer: "No minimums, no contracts. Pay for what you get.",
  },
  {
    question: "Can I pause?",
    answer: "Yes. Deactivate your QR codes anytime. Reactivate when ready. No penalties.",
  },
  {
    question: "What counts as a qualified lead?",
    answer: "A completed chatbot conversation with name collected, phone number collected, and service need identified. We don't charge for incomplete conversations.",
  },
  {
    question: "Do I need to sign a contract?",
    answer: "No contracts ever. Month-to-month, cancel anytime.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Pay Per Lead. <span className="gradient-text">Nothing Else.</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            No monthly fees. No contracts. No per-scan charges. You only pay when we 
            deliver a qualified lead.
          </p>
        </div>
      </section>

      {/* What's a Qualified Lead */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
              What's a Qualified Lead?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "✅", text: "Completed conversation" },
                { icon: "👤", text: "Name collected" },
                { icon: "📞", text: "Phone number collected" },
                { icon: "🔧", text: "Service need identified" },
              ].map((item) => (
                <div key={item.text} className="card">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-medium text-neutral-700">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-neutral-600">
              Your price is based on your industry's average job value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.tier}
                className={`card relative ${tier.popular ? "ring-2 ring-primary-500 scale-105" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-r ${tier.color} text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4`}>
                  {tier.tier}
                </div>
                <div className="text-5xl font-bold text-neutral-900 mb-2">
                  ${tier.price}
                  <span className="text-lg font-normal text-neutral-500">/lead</span>
                </div>
                <p className="text-neutral-600 text-sm mb-4">{tier.description}</p>
                <ul className="space-y-2">
                  {tier.industries.map((industry) => (
                    <li key={industry} className="flex items-center gap-2 text-sm text-neutral-700">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {industry}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-neutral-500 mt-8">
            Higher ticket = higher lead value = higher price. Still a fraction of what you'd pay anywhere else.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything Included
            </h2>
            <p className="text-lg text-neutral-600">
              Every plan gets the full package
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Fee */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              One-Time Setup: <span className="text-accent-400">$99</span>
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Get everything configured and ready to go
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: "🎓", title: "Onboarding", description: "Personal walkthrough" },
                { icon: "🤖", title: "Chatbot Training", description: "AI learns your business" },
                { icon: "🎨", title: "QR Design", description: "First QR code design included" },
              ].map((item) => (
                <div key={item.title} className="bg-neutral-800 rounded-xl p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Optional Add-ons
            </h2>
            <p className="text-lg text-neutral-600">
              Power up your account when you need more
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {addons.map((addon, i) => (
                <div key={addon.name} className={`flex items-center justify-between p-6 ${i !== addons.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{addon.name}</h3>
                    <p className="text-neutral-600 text-sm">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-neutral-900">${addon.price}</span>
                    <span className="text-neutral-500">{addon.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Compare to Alternatives
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-neutral-100 font-semibold text-sm">
                <div className="p-4">Source</div>
                <div className="p-4 text-center">Cost Per Lead</div>
                <div className="p-4 text-center">Lead Quality</div>
              </div>
              {comparison.map((row) => (
                <div key={row.source} className={`grid grid-cols-3 border-t border-neutral-100 ${row.highlight ? "bg-primary-50" : ""}`}>
                  <div className={`p-4 font-medium ${row.highlight ? "text-primary-700" : "text-neutral-700"}`}>
                    {row.source}
                  </div>
                  <div className={`p-4 text-center ${row.highlight ? "text-primary-700 font-semibold" : "text-neutral-600"}`}>
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

      {/* FAQs */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{faq.question}</h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            $99 setup, then pay only for qualified leads. No monthly minimums.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Get Started - $99 Setup
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
