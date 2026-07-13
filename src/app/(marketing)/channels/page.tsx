import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channels - Tapzilla",
  description:
    "Put Tapzilla everywhere. Vehicle QR codes, job site signs, partner locations, and smart business cards.",
};

const channels = [
  {
    icon: "🚐",
    title: "Vehicle QR",
    description: "Your truck is already a billboard. Now it's a lead machine. Every time you park, you're generating leads.",
    href: "/channels/vehicle",
    image: "🚚",
    bestFor: "Constant exposure",
    visibility: "High (moving billboard)",
    lifespan: "Permanent",
  },
  {
    icon: "🏠",
    title: "Job Site Signs",
    description: "Every completed job markets the next one. Leave a sign, capture the neighbors who saw you working.",
    href: "/channels/job-site",
    image: "🪧",
    bestFor: "Neighbor conversion",
    visibility: "Medium (localized)",
    lifespan: "Days-weeks",
  },
  {
    icon: "📍",
    title: "Partner Locations",
    description: "Your placard on counters across town. Barbershops, coffee shops, waiting rooms - anywhere people have time to scan.",
    href: "/channels/partner",
    image: "🏪",
    bestFor: "Passive lead gen",
    visibility: "High (foot traffic)",
    lifespan: "Permanent",
  },
  {
    icon: "💳",
    title: "Smart Business Cards",
    description: "Cards that start conversations, not collect dust. NFC tap or QR scan - either way, you get the lead.",
    href: "/channels/handout",
    image: "💳",
    bestFor: "Direct networking",
    visibility: "1-to-1",
    lifespan: "Varies",
  },
];

export default function ChannelsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Put Tapzilla <span className="gradient-text">Everywhere</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Your QR code works anywhere. The AI conversation is the same.
          </p>
        </div>
      </section>

      {/* Channel Cards */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {channels.map((channel) => (
              <Link
                key={channel.title}
                href={channel.href}
                className="card group hover:border-primary-500 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{channel.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{channel.icon}</span>
                      <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {channel.title}
                      </h3>
                    </div>
                    <p className="text-neutral-600 mb-4">{channel.description}</p>
                    <span className="text-primary-600 font-medium inline-flex items-center gap-1">
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

      {/* Comparison Table */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Channel Comparison
            </h2>
            <p className="text-lg text-neutral-600">
              Choose the right channels for your business
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="text-left p-4 font-semibold">Channel</th>
                  <th className="text-left p-4 font-semibold">Best For</th>
                  <th className="text-left p-4 font-semibold">Visibility</th>
                  <th className="text-left p-4 font-semibold">Lifespan</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel, i) => (
                  <tr key={channel.title} className={i !== channels.length - 1 ? "border-b border-neutral-100" : ""}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{channel.icon}</span>
                        <span className="font-medium">{channel.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">{channel.bestFor}</td>
                    <td className="p-4 text-neutral-600">{channel.visibility}</td>
                    <td className="p-4 text-neutral-600">{channel.lifespan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Multi-Channel Strategy */}
      <section className="section">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Most Businesses Use <span className="gradient-text">Multiple Channels</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Your trucks, your job sites, your partners, your cards - all generating leads 
            to the same AI salesperson.
          </p>
          <Link href="/contact" className="btn-primary text-lg px-8 py-4">
            Talk to Us About Your Setup
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Deploy Your AI Salesperson?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
            <Link href="/pricing" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
