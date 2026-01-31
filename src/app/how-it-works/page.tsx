import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works - Tapzilla",
  description:
    "See exactly what happens when someone scans your Tapzilla QR code. The AI conversation that converts strangers into qualified leads.",
};

const conversationExample = [
  { type: "bot", text: "Hey! I'm the assistant for Pro Carpet Care. Looking for carpet cleaning? I can help you get a quote in about 60 seconds." },
  { type: "bot", text: "What kind of service are you looking for?" },
  { type: "options", options: ["Carpet Cleaning", "Pet Stain Treatment", "Tile & Grout"] },
  { type: "user", text: "Carpet Cleaning" },
  { type: "bot", text: "How many rooms do you need cleaned?" },
  { type: "user", text: "3 rooms and a hallway" },
  { type: "bot", text: "Got it! When do you need this done?" },
  { type: "options", options: ["This week (urgent)", "Within 2 weeks", "Just getting quotes"] },
  { type: "user", text: "Within 2 weeks" },
  { type: "bot", text: "For 3 rooms and a hallway, you're typically looking at $150-200.\n\nWhat's the best phone number to reach you?" },
  { type: "user", text: "719-555-1234" },
  { type: "bot", text: "And your name?" },
  { type: "user", text: "Mike" },
  { type: "bot", text: "Thanks Mike! Someone from Pro Carpet Care will call you within a few hours to confirm your appointment." },
];

const customizations = [
  { icon: "🎨", title: "Your logo and colors", description: "Fully branded to your business" },
  { icon: "📋", title: "Services and pricing", description: "Your exact offerings and price ranges" },
  { icon: "❓", title: "Common questions", description: "FAQ training from your knowledge" },
  { icon: "🎭", title: "Tone of voice", description: "Professional, friendly, or casual" },
  { icon: "📍", title: "Service area", description: "Auto-rejects out-of-area requests" },
  { icon: "🎁", title: "Special offers", description: "Seasonal promotions and discounts" },
];

const whyItWorks = [
  { title: "No friction", description: "Chat is natural, forms are annoying" },
  { title: "Instant answers", description: "Bot knows your services, pricing, FAQs" },
  { title: "Always on", description: "Works at 2am, works on weekends" },
  { title: "Pre-qualified", description: "You know what they need before you call" },
  { title: "Warm prospect", description: "They already 'talked' to your business" },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-gradient-to-br from-neutral-50 via-white to-primary-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            The Conversation That <span className="gradient-text">Converts</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            See exactly what happens when someone scans your Tapzilla QR code
          </p>
        </div>
      </section>

      {/* Section 1: The Scan */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold mb-4">
                Step 1
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                The Scan
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Someone sees your QR code - on your truck, at a job site, on a card, 
                at a partner location. They scan with their phone camera.
              </p>
              <ul className="space-y-3">
                {[
                  "Works with any smartphone camera",
                  "No app needed to scan",
                  "Mobile-optimized page branded to YOUR business",
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
            <div className="bg-neutral-100 rounded-3xl p-8 text-center">
              <div className="text-8xl mb-4">📱</div>
              <p className="text-neutral-600">Phone camera recognizes QR code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Greeting */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white rounded-3xl p-6 shadow-xl">
              <div className="bg-primary-600 text-white p-4 rounded-t-2xl -mt-6 -mx-6 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold">PC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Pro Carpet Care</h3>
                    <p className="text-xs text-white/80">Online now</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="chat-bubble-bot">
                  <p>Hey! I'm the assistant for Pro Carpet Care. Looking for carpet cleaning? I can help you get a quote in about 60 seconds.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold mb-4">
                Step 2
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                The Greeting
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Your AI assistant greets them by your business name. Warm, friendly, 
                professional - exactly how you'd want your best employee to answer.
              </p>
              <p className="text-neutral-500 italic">
                "Not a generic chatbot. YOUR chatbot, for YOUR business."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Qualification */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold mb-4">
              Step 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              The Qualification
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              A natural conversation that qualifies the lead without feeling like a form
            </p>
          </div>

          {/* Chat Example */}
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-primary-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-bold">PC</span>
                </div>
                <div>
                  <h3 className="font-semibold">Pro Carpet Care</h3>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-neutral-50 max-h-96 overflow-y-auto">
              {conversationExample.map((msg, i) => {
                if (msg.type === "options") {
                  return (
                    <div key={i} className="flex gap-2 flex-wrap">
                      {msg.options?.map((opt) => (
                        <span key={opt} className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-neutral-700">
                          {opt}
                        </span>
                      ))}
                    </div>
                  );
                }
                return (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={msg.type === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Lead Delivery */}
      <section className="section section-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-400 px-4 py-2 rounded-full font-semibold mb-4">
                Step 4
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Lead Delivery
              </h2>
              <p className="text-lg text-neutral-300 mb-6">
                You receive the lead instantly - via email, SMS, webhook, or in your 
                dashboard. Full details and conversation transcript included.
              </p>
              <ul className="space-y-3 text-neutral-300">
                {[
                  "Delivered in seconds, not hours",
                  "Full conversation transcript",
                  "Know exactly what they need",
                  "Call them while they're still interested",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-lg">New Lead from Tapzilla</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Name:</span>
                  <span className="font-medium">Mike</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Phone:</span>
                  <span className="font-medium">719-555-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Service:</span>
                  <span className="font-medium">Carpet Cleaning (3 rooms + hallway)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Timeline:</span>
                  <span className="font-medium">Within 2 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Est. Value:</span>
                  <span className="font-medium text-green-400">$150-200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Source:</span>
                  <span className="font-medium text-primary-400">Vehicle QR - Truck #1</span>
                </div>
                <div className="border-t border-neutral-700 pt-3 mt-3 flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium">
                    Call Now
                  </button>
                  <button className="flex-1 bg-neutral-700 text-white py-2 rounded-lg font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Why This Works */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why This <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyItWorks.map((item) => (
              <div key={item.title} className="card text-center">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Customization */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What You Can <span className="gradient-text">Customize</span>
            </h2>
            <p className="text-lg text-neutral-600">
              Make it truly yours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customizations.map((item) => (
              <div key={item.title} className="card flex items-start gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            See it for yourself
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Try a live demo or get started with your own AI salesperson today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#demo" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Try a Demo
            </Link>
            <Link href="/signup" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
