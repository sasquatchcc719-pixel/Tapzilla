import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Site Signs - Tapzilla",
  description:
    "Turn every completed job into marketing for the next one. Yard signs and door hangers that capture neighbor leads.",
};

const products = [
  {
    icon: "🪧",
    title: "Yard Signs",
    description: "Temporary placement (1-4 weeks)",
    details: ["H-stake or wire frame", "'We just serviced this home'", "Weather-resistant"],
  },
  {
    icon: "🚪",
    title: "Door Hangers",
    description: "Leave on neighboring doors",
    details: ["'Your neighbor chose us'", "Include special offer", "Track by neighborhood"],
  },
  {
    icon: "🪟",
    title: "Window Clings",
    description: "Inside window facing out",
    details: ["Longer lasting", "Professional look", "Customer permission required"],
  },
];

export default function JobSitePage() {
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
                Every Completed Job Markets{" "}
                <span className="gradient-text">The Next One</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Neighbors see you working. Now they can easily hire you too.
              </p>
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Order Job Site Signs
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="text-[12rem]">🪧</div>
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
              <li>You do great work</li>
              <li>The neighbors see your truck</li>
              <li>They don't know how to contact you</li>
              <li className="text-accent-400 font-semibold">By the time they need service, they forgot your name</li>
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

          <div className="max-w-3xl mx-auto">
            <div className="card p-8 text-center">
              <p className="text-xl text-neutral-700 mb-6">
                Leave a sign or hanger after every job
              </p>
              <div className="bg-primary-50 rounded-xl p-6">
                <p className="text-lg font-semibold text-primary-800">
                  "Your neighbor just got their carpets cleaned. Scan for $20 off yours."
                </p>
              </div>
              <p className="text-neutral-600 mt-6">
                Social proof + easy action = leads on autopilot
              </p>
            </div>
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

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.title} className="card">
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{product.title}</h3>
                <p className="text-neutral-600 mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-neutral-700">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
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
                  "Unique QR per job site (optional)",
                  "Track which neighborhoods convert",
                  "See geographic patterns",
                  "Prove ROI of sign placement",
                  "Know exactly which job generated which lead",
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
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="font-semibold text-neutral-800 mb-2">We just serviced this home!</p>
                  <div className="text-6xl mb-2">📱</div>
                  <div className="text-sm text-neutral-500">Scan for neighbor discount</div>
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
            Start Converting Neighbors Into Customers
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get yard signs, door hangers, and window clings for your jobs
          </p>
          <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Order Job Site Signs
          </Link>
        </div>
      </section>
    </div>
  );
}
