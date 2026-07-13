import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Tapzilla",
  description:
    "The story behind Tapzilla. We're building the future of lead generation for local service businesses.",
};

const values = [
  {
    icon: "🎯",
    title: "Results First",
    description: "You pay for leads, not promises. If we don't deliver, you don't pay.",
  },
  {
    icon: "🤝",
    title: "Built for Small Business",
    description: "We know you're not a Fortune 500. Our tools and pricing reflect that.",
  },
  {
    icon: "⚡",
    title: "Simple Over Complex",
    description: "No dashboards with 47 tabs. No training required. It just works.",
  },
  {
    icon: "📱",
    title: "Modern Technology",
    description: "AI that actually helps, not gimmicks. Conversations, not forms.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Our <span className="gradient-text">Story</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We saw a broken system and decided to fix it.
          </p>
        </div>
      </section>

      {/* The Problem We Saw */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
              QR Codes Were a Dead End
            </h2>
            <div className="prose prose-lg text-neutral-600 space-y-6">
              <p>
                We watched local service businesses invest in vehicle wraps, yard signs, 
                business cards - all with QR codes that led to... their website.
              </p>
              <p>
                The same website that wasn't converting anyway.
              </p>
              <p>
                People would scan, land on a homepage, look around for 10 seconds, and leave. 
                No lead captured. No way to follow up. The business had no idea anyone even scanned.
              </p>
              <p className="font-semibold text-neutral-900">
                That's not lead generation. That's a missed opportunity factory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution We Built */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
              So We Built Something Better
            </h2>
            <div className="prose prose-lg text-neutral-600 space-y-6">
              <p>
                What if every scan started a conversation instead of a dead end?
              </p>
              <p>
                We built an AI chatbot that greets people like your best employee would. 
                It asks what they need, answers their questions, and captures their information 
                - all in a natural conversation.
              </p>
              <p>
                Now that QR code on your truck actually works. The yard sign actually generates 
                leads. The business card actually starts relationships.
              </p>
              <p className="font-semibold text-neutral-900">
                Every scan becomes a potential customer, not a bounce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What We Believe
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Built for <span className="text-primary-400">Local Service Businesses</span>
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              We're not building for enterprise. We're not trying to be everything to everyone. 
              We're laser-focused on helping local service businesses get more customers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-4xl">
              <div>🏠</div>
              <div>🔧</div>
              <div>🧹</div>
              <div>🌿</div>
              <div>❄️</div>
              <div>⚡</div>
              <div>🎨</div>
              <div>🚗</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Fix Your Lead Generation?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of local service businesses already using Tapzilla.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
