import Link from "next/link";
import ChatDemo from "@/components/chat/ChatDemo";

const industries = [
  { name: "Roofing", icon: "🏠", href: "/industries/roofing" },
  { name: "HVAC", icon: "❄️", href: "/industries/hvac" },
  { name: "Plumbing", icon: "🔧", href: "/industries/plumbing" },
  { name: "Carpet Cleaning", icon: "🧹", href: "/industries/carpet-cleaning" },
  { name: "House Cleaning", icon: "🏡", href: "/industries/house-cleaning" },
  { name: "Landscaping", icon: "🌿", href: "/industries/landscaping" },
  { name: "Pest Control", icon: "🐜", href: "/industries/pest-control" },
  { name: "Electrical", icon: "⚡", href: "/industries/electrical" },
  { name: "Painting", icon: "🎨", href: "/industries/painting" },
  { name: "Auto Detailing", icon: "🚗", href: "/industries/auto-detailing" },
];

const pricingTiers = [
  {
    tier: "Premium",
    price: "$10",
    industries: "Roofing, HVAC, Water Restoration, Solar",
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  {
    tier: "Standard",
    price: "$5",
    industries: "Plumbing, Electrical, Painting, General Contractors",
    color: "bg-gradient-to-r from-primary-500 to-primary-700",
  },
  {
    tier: "Basic",
    price: "$2",
    industries: "Carpet Cleaning, House Cleaning, Landscaping, Pest Control",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    tier: "Starter",
    price: "$1",
    industries: "Pet Grooming, Auto Detailing, Small Services",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
  },
];

const channels = [
  {
    icon: "🚐",
    title: "Vehicle QR",
    description: "Your truck is a billboard. Now it's a lead machine.",
    href: "/channels/vehicle",
  },
  {
    icon: "🏠",
    title: "Job Site Signs",
    description: "Neighbors see you working. Now they can hire you.",
    href: "/channels/job-site",
  },
  {
    icon: "📍",
    title: "Partner Locations",
    description: "Your placard on their counter. Leads on autopilot.",
    href: "/channels/partner",
  },
  {
    icon: "💳",
    title: "Smart Business Cards",
    description: "Cards that start conversations, not collect dust.",
    href: "/channels/handout",
  },
];

const comparisonData = [
  {
    feature: "What happens on scan",
    old: "Links to website",
    new: "Starts a conversation",
  },
  { feature: "Lead capture", old: "Hope they call", new: "Captures their info" },
  { feature: "Tracking", old: "No tracking", new: "Know every scan" },
  { feature: "Result", old: "Dead end", new: "Qualified lead" },
  { feature: "Value", old: "$0 value", new: "Actual lead value" },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                An AI Salesperson Behind Every{" "}
                <span className="gradient-text">QR Code</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 mb-8">
                Stop sending people to your website and hoping they call. Tapzilla
                turns every scan into a conversation that captures qualified leads
                automatically.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#demo" className="btn-primary text-lg px-8 py-4">
                  See It In Action
                </Link>
                <Link href="/signup" className="btn-outline text-lg px-8 py-4">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl rounded-full" />
              <ChatDemo />
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/50 to-transparent -z-10" />
      </section>

      {/* The Problem Section */}
      <section className="section section-dark">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            QR Codes Are <span className="text-accent-400">Broken</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-neutral-300 mb-8">
              You put a QR code on your truck. Someone scans it. They land on your
              website. They leave. You have no idea it happened.
            </p>
            <p className="text-2xl font-semibold text-white">
              That's not lead generation. That's a{" "}
              <span className="text-accent-400">dead end</span>.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="section" id="demo">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What If Every Scan Started a{" "}
              <span className="gradient-text">Conversation</span>?
            </h2>
          </div>

          {/* Visual Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <div className="card text-center p-8">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-lg">Scan</h3>
            </div>
            <div className="text-4xl text-primary-500 rotate-90 md:rotate-0">→</div>
            <div className="card text-center p-8">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-lg">Chat</h3>
            </div>
            <div className="text-4xl text-primary-500 rotate-90 md:rotate-0">→</div>
            <div className="card text-center p-8 border-2 border-accent-500">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg">Lead Delivered</h3>
            </div>
          </div>

          <p className="text-xl text-center text-neutral-600 max-w-3xl mx-auto">
            Our AI chatbot greets them, asks what they need, answers their questions,
            and collects their info. You get a qualified lead with name, phone,
            email, and exactly what they're looking for.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: 1,
                title: "Put your QR code anywhere",
                description:
                  "Trucks, yard signs, business cards, partner locations - anywhere people see your brand",
                icon: "📍",
              },
              {
                step: 2,
                title: "Someone scans",
                description:
                  "They're greeted by YOUR AI assistant, branded to your business",
                icon: "📱",
              },
              {
                step: 3,
                title: "The conversation happens",
                description:
                  '"What service do you need?" "When do you need it?" "What\'s the best number to reach you?" - Plus answers their questions from your FAQ',
                icon: "💬",
              },
              {
                step: 4,
                title: "You get the lead",
                description:
                  "Name, phone, email, address, service needed, timeline - delivered instantly",
                icon: "🎯",
              },
              {
                step: 5,
                title: "You close",
                description:
                  "Call a warm prospect who already wants to talk to you",
                icon: "✅",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {item.step}. {item.title}
                  </h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Magic Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                The Magic Is The <span className="gradient-text">Conversation</span>
              </h2>
              <ul className="space-y-4">
                {[
                  "No forms to fill out",
                  "No waiting on hold",
                  "No hoping they call",
                  "Answers questions instantly",
                  "Works 24/7, even holidays",
                  "Captures info naturally",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-lg text-neutral-600 italic">
                "It's like having your best receptionist working 24/7 on every
                truck, every sign, every card."
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-primary-500/20 blur-3xl rounded-full" />
              <ChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Four Channels Section */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Four Ways to Deploy
            </h2>
            <p className="text-xl text-neutral-300">
              Put your AI salesperson everywhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((channel) => (
              <Link
                key={channel.title}
                href={channel.href}
                className="bg-neutral-800 rounded-2xl p-6 hover:bg-neutral-700 transition-colors group"
              >
                <div className="text-4xl mb-4">{channel.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                  {channel.title}
                </h3>
                <p className="text-neutral-400 mb-4">{channel.description}</p>
                <span className="text-primary-400 font-medium inline-flex items-center gap-1">
                  Learn More
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Pay Per Qualified Lead.{" "}
              <span className="gradient-text">Nothing Else.</span>
            </h2>
            <p className="text-xl text-neutral-600">
              No monthly fees. No contracts. You only pay when we deliver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingTiers.map((tier) => (
              <div key={tier.tier} className="card">
                <div
                  className={`${tier.color} text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4`}
                >
                  {tier.tier}
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2">
                  {tier.price}
                  <span className="text-lg font-normal text-neutral-500">
                    /lead
                  </span>
                </div>
                <p className="text-neutral-600 text-sm">{tier.industries}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              The Old Way vs The{" "}
              <span className="gradient-text">Tapzilla Way</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-neutral-100 font-semibold">
                <div className="p-4 text-center"></div>
                <div className="p-4 text-center text-neutral-500">Old QR Code</div>
                <div className="p-4 text-center text-primary-600">Tapzilla</div>
              </div>
              {comparisonData.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 border-t border-neutral-100"
                >
                  <div className="p-4 font-medium text-neutral-700">
                    {row.feature}
                  </div>
                  <div className="p-4 text-center text-neutral-400">{row.old}</div>
                  <div className="p-4 text-center text-primary-600 font-medium">
                    {row.new}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Trusted by Local Service Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { stat: "10,000+", label: "Leads Delivered" },
              { stat: "50,000+", label: "Conversations" },
              { stat: "500+", label: "Businesses" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-5xl font-bold gradient-text mb-2">
                  {item.stat}
                </div>
                <div className="text-neutral-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial placeholder */}
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="text-xl text-neutral-600 italic mb-4">
              "We put Tapzilla on our trucks and started getting 3-5 extra leads a
              week. These are people who saw us working in their neighborhood. The
              ROI is insane."
            </blockquote>
            <div className="font-semibold text-neutral-900">
              — Mike Johnson, Pro Carpet Care
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Built for <span className="gradient-text">Your Industry</span>
            </h2>
            <p className="text-xl text-neutral-600">
              AI trained specifically for home service businesses
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {industries.map((industry) => (
              <Link
                key={industry.name}
                href={industry.href}
                className="card text-center hover:border-primary-500 transition-colors"
              >
                <div className="text-3xl mb-2">{industry.icon}</div>
                <div className="font-medium text-neutral-700">{industry.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Turn Every Scan Into a Lead?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            No monthly fees. Pay only for results. Get started with a $99 setup and
            see your first leads roll in.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Free
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
