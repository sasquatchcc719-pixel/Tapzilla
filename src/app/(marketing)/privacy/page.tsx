import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Tapzilla",
  description: "Tapzilla privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <div className="section">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg text-neutral-600 space-y-6">
            <p className="text-sm text-neutral-500">Last updated: January 2026</p>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Introduction
              </h2>
              <p>
                Tapzilla ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and share information 
                about you when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Information We Collect
              </h2>
              <h3 className="text-xl font-medium text-neutral-800 mt-6 mb-3">
                Information You Provide
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, phone number)</li>
                <li>Business information (company name, industry, services)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communications with us (support requests, feedback)</li>
              </ul>

              <h3 className="text-xl font-medium text-neutral-800 mt-6 mb-3">
                Information Collected Through Our Services
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lead information collected through chatbot conversations</li>
                <li>QR code scan data (time, location if permitted)</li>
                <li>Conversation transcripts between leads and your AI assistant</li>
                <li>Usage analytics and performance metrics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                How We Use Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Deliver leads to your business</li>
                <li>Process payments</li>
                <li>Communicate with you about your account</li>
                <li>Analyze and improve our AI chatbot performance</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Information Sharing
              </h2>
              <p>We do not sell your personal information. We may share information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With service providers who help us operate our business</li>
                <li>With businesses you've authorized us to deliver leads to</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Data Retention
              </h2>
              <p>
                We retain your information for as long as your account is active or as 
                needed to provide services. Lead data is retained according to our 
                business customers' requirements and applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Your Rights
              </h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your information</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your information. However, no method of transmission over the internet is 
                100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="font-medium">hello@tapzilla.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
