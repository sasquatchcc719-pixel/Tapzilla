import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle QR Codes - Tapzilla",
  description:
    "Turn your work trucks into lead machines. QR codes that start conversations, not dead ends.",
};

const placements = [
  { location: "Side doors", description: "Eye level when parked - perfect for neighborhoods" },
  { location: "Tailgate", description: "Visible in traffic - passengers scan while waiting" },
  { location: "Rear window", description: "Clear visibility, easy to scan" },
  { location: "Wrap integration", description: "Built into your existing vehicle graphics" },
];

const useCases = [
  { icon: "🏠", title: "Parked at a job site", description: "Neighbors see your truck and scan to learn about your services" },
  { icon: "🏡", title: "Parked at your house", description: "Your own neighborhood becomes a lead source" },
  { icon: "🚗", title: "In traffic", description: "Bored passengers scan your QR code while waiting" },
  { icon: "🛒", title: "At the store", description: "Parking lot exposure while you run errands" },
];

export default function VehiclePage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Link href="/channels" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Channels
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Your Truck Is Already a Billboard.{" "}
                <span className="gradient-text">Now It's a Lead Machine.</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Turn every park job, every drive, every stop into an opportunity to 
                capture qualified leads.
              </p>
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Get Your Vehicle QR
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="text-[12rem]">🚚</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem</h2>
            <ul className="space-y-4 text-lg text-neutral-300">
              <li>You paid for the wrap or lettering</li>
              <li>People see your truck everywhere</li>
              <li>They think "I should call them"</li>
              <li className="text-accent-400 font-semibold">Then they forget</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              The Solution
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "📱", text: "QR code on vehicle doors, tailgate, or wrap" },
              { icon: "🚗", text: "Scannable in traffic, at job sites, parked at home" },
              { icon: "💬", text: "'Scan for Instant Quote' messaging" },
              { icon: "🎯", text: "Every scan starts the conversation" },
            ].map((item) => (
              <div key={item.text} className="card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-neutral-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Placements */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Best Placements
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {placements.map((item) => (
              <div key={item.location} className="card">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.location}</h3>
                <p className="text-neutral-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                What You Get
              </h2>
              <ul className="space-y-4">
                {[
                  "Large format QR code design",
                  "Tracking per vehicle (if multiple trucks)",
                  "See which truck generates most leads",
                  "Works anywhere the truck goes",
                  "Analytics by location and time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-100 rounded-3xl p-8">
              <div className="text-center">
                <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-sm text-neutral-500">Scan for Instant Quote</div>
                </div>
                <p className="text-neutral-600 text-sm">Example vehicle QR placement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Use Cases
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((item) => (
              <div key={item.title} className="card">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Turn Your Fleet Into a Lead Machine
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get custom QR codes designed for your vehicles
          </p>
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Get Your Vehicle QR
          </Link>
        </div>
      </section>
    </div>
  );
}
