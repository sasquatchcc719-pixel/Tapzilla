import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Tapzilla",
  description: "Tapzilla terms of service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="section">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg text-neutral-600 space-y-6">
            <p className="text-sm text-neutral-500">Last updated: January 2026</p>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Agreement to Terms
              </h2>
              <p>
                By accessing or using Tapzilla's services, you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Description of Service
              </h2>
              <p>
                Tapzilla provides AI-powered lead generation services through QR codes and 
                chatbot technology. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom branded chatbot experiences</li>
                <li>QR code generation and tracking</li>
                <li>Lead capture and delivery</li>
                <li>Analytics and reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Account Registration
              </h2>
              <p>
                To use our services, you must create an account and provide accurate, 
                complete information. You are responsible for maintaining the security 
                of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Payment Terms
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Setup fee of $99 is due at account activation</li>
                <li>Lead charges are billed monthly based on qualified leads delivered</li>
                <li>Add-on services are billed monthly as applicable</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>You authorize us to charge your payment method on file</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Lead Quality
              </h2>
              <p>A "qualified lead" is defined as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Completed chatbot conversation</li>
                <li>Name collected</li>
                <li>Valid phone number collected</li>
                <li>Service need identified</li>
              </ul>
              <p className="mt-4">
                If you believe a lead does not meet these criteria, you may request a 
                review within 7 days of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Acceptable Use
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Provide false or misleading information about your business</li>
                <li>Interfere with or disrupt the service</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Use the service to send spam or unsolicited communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Intellectual Property
              </h2>
              <p>
                Tapzilla retains all rights to our technology, software, and branding. 
                You retain rights to your business content and branding used in your 
                chatbot experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Limitation of Liability
              </h2>
              <p>
                Tapzilla is not liable for any indirect, incidental, special, or 
                consequential damages. Our total liability shall not exceed the 
                amount you paid us in the 12 months prior to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Termination
              </h2>
              <p>
                Either party may terminate the service at any time. Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Outstanding balances become immediately due</li>
                <li>Your QR codes will be deactivated</li>
                <li>Lead data will be retained for 30 days then deleted</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Changes to Terms
              </h2>
              <p>
                We may update these terms from time to time. Continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
                Contact
              </h2>
              <p>
                Questions about these Terms of Service? Contact us at:
              </p>
              <p className="font-medium">hello@tapzilla.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
