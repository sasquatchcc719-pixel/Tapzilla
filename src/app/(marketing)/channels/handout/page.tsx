import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Business Cards - Tapzilla",
  description:
    "NFC business cards that start conversations. Tap or scan to connect instantly with your AI salesperson.",
};

const products = [
  {
    icon: "💳",
    title: "NFC Business Cards",
    description: "Premium tap-to-scan technology",
    features: [
      "Tap to phone - instant connection",
      "QR code backup for any device",
      "Premium feel and durability",
      "Works with any smartphone",
    ],
  },
  {
    icon: "📄",
    title: "Smart Leave-Behinds",
    description: "For estimates that don't close",
    features: [
      "'Still thinking? Scan to chat'",
      "Captures leads from maybes",
      "Track engagement after you leave",
      "Re-engage cold prospects",
    ],
  },
];

export default function HandoutPage() {
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
                Business Cards That Start{" "}
                <span className="gradient-text">Conversations</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Not collect dust. NFC tap or QR scan - either way, your AI salesperson 
                takes over.
              </p>
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Order Smart Cards
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="text-[12rem]">💳</div>
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
              <li>You hand out business cards</li>
              <li>They go in a pocket</li>
              <li>Then the trash</li>
              <li className="text-accent-400 font-semibold">No tracking, no follow-up, no idea if it worked</li>
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

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {[
                { step: "1", icon: "🤝", text: "Hand someone your card" },
                { step: "2", icon: "📱", text: "They tap it (or scan QR)" },
                { step: "3", icon: "💬", text: "Chatbot starts" },
                { step: "4", icon: "🎯", text: "You get the lead" },
              ].map((item) => (
                <div key={item.step} className="card">
                  <div className="text-xs font-semibold text-primary-600 mb-2">Step {item.step}</div>
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="text-neutral-700 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            
            <p className="text-center text-lg text-neutral-600 mt-8">
              Even if they "lose" the card, you already got the lead.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Products
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <div key={product.title} className="card">
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{product.title}</h3>
                <p className="text-neutral-600 mb-6">{product.description}</p>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-neutral-700">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
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
                  "Track every card interaction",
                  "Know which networking events convert",
                  "Follow up with people who engaged",
                  "See: 'This card was tapped 3 times before they submitted'",
                  "Never wonder if your cards are working",
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
                <div className="inline-block bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6 shadow-xl text-white">
                  <div className="text-xl font-bold mb-1">Pro Carpet Care</div>
                  <div className="text-sm text-neutral-400 mb-4">Mike Johnson</div>
                  <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                  <div className="text-xs text-neutral-400">TAP or SCAN</div>
                </div>
                <p className="text-neutral-600 text-sm mt-4">NFC Smart Business Card</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Upgrade Your Business Cards
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Cards that actually work. Track every interaction.
          </p>
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Order Smart Cards
          </Link>
        </div>
      </section>
    </div>
  );
}
