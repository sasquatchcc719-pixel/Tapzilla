import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Locations - Tapzilla",
  description:
    "Put your AI salesperson in barbershops, coffee shops, and waiting rooms across town. Passive lead generation from foot traffic.",
};

const locations = [
  { icon: "💈", name: "Barbershops / Salons", reason: "Captive waiting audience" },
  { icon: "☕", name: "Coffee Shops", reason: "People killing time" },
  { icon: "🧺", name: "Laundromats", reason: "Long dwell time" },
  { icon: "🔧", name: "Auto Shops", reason: "Waiting rooms" },
  { icon: "🍽️", name: "Restaurants", reason: "Waiting for table" },
  { icon: "🏋️", name: "Gyms / Fitness Studios", reason: "Community-minded customers" },
  { icon: "🏠", name: "Real Estate Offices", reason: "New homeowners" },
  { icon: "🏢", name: "Property Management", reason: "Rental turnover" },
];

export default function PartnerPage() {
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
                Your Placard on Every Counter{" "}
                <span className="gradient-text">In Town</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Partner locations have foot traffic. Put your AI salesperson where 
                people have time to scan.
              </p>
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Building Your Network
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="text-[12rem]">🏪</div>
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
              <li>Partner locations have foot traffic</li>
              <li>You have no presence there</li>
              <li>Other businesses do (their cards, their flyers)</li>
              <li className="text-accent-400 font-semibold">You're invisible</li>
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

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              { icon: "📍", title: "Permanent placard", description: "Professional display at partner locations" },
              { icon: "👥", title: "High-traffic areas", description: "Waiting rooms, counters, checkout areas" },
              { icon: "📊", title: "Every scan tracked", description: "Know which locations produce" },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Trade */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
              The Trade
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card bg-primary-50 border-primary-200">
                <h3 className="font-semibold text-lg text-primary-800 mb-4">You Give Them</h3>
                <p className="text-primary-700">A Google Review placard for THEIR business</p>
              </div>
              <div className="card bg-accent-50 border-accent-200">
                <h3 className="font-semibold text-lg text-accent-800 mb-4">They Give You</h3>
                <p className="text-accent-700">Counter/wall space for your lead gen placard</p>
              </div>
            </div>

            <p className="text-xl text-neutral-600 mt-8">
              Win-win. No money changes hands.
            </p>
          </div>
        </div>
      </section>

      {/* Best Locations */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Best Locations
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {locations.map((location) => (
              <div key={location.name} className="card text-center">
                <div className="text-4xl mb-3">{location.icon}</div>
                <h3 className="font-semibold text-neutral-900 mb-1">{location.name}</h3>
                <p className="text-neutral-500 text-sm">{location.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                What You Get
              </h2>
              <ul className="space-y-4">
                {[
                  "Professional placard design",
                  "Unique code per location",
                  "Track which locations produce",
                  "Health monitoring (alerts if scans stop)",
                  "Partner relationship management",
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
                <div className="inline-block bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-sm text-neutral-500 mb-2">Partner Location Placard</div>
                  <div className="font-bold text-xl text-neutral-800 mb-2">Pro Carpet Care</div>
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-sm text-neutral-500">Scan for instant quote</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Build Your Partner Network
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get professional placards and start generating passive leads
          </p>
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Start Building Your Network
          </Link>
        </div>
      </section>
    </div>
  );
}
