"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OnboardingData {
  companyName: string;
  phone: string;
  city: string;
  state: string;
  industryId: string;
}

const industries = [
  { id: "roofing", name: "Roofing", icon: "🏠", price: 10 },
  { id: "hvac", name: "HVAC", icon: "❄️", price: 10 },
  { id: "plumbing", name: "Plumbing", icon: "🔧", price: 5 },
  { id: "electrical", name: "Electrical", icon: "⚡", price: 5 },
  { id: "carpet-cleaning", name: "Carpet Cleaning", icon: "🧹", price: 2 },
  { id: "house-cleaning", name: "House Cleaning", icon: "🏡", price: 2 },
  { id: "landscaping", name: "Landscaping", icon: "🌳", price: 2 },
  { id: "painting", name: "Painting", icon: "🎨", price: 5 },
  { id: "pest-control", name: "Pest Control", icon: "🐜", price: 2 },
  { id: "auto-detailing", name: "Auto Detailing", icon: "🚗", price: 1 },
  { id: "other", name: "Other", icon: "📦", price: 2 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    phone: "",
    city: "",
    state: "",
    industryId: "",
  });
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get industry UUID
      const { data: industry } = await supabase
        .from("industries")
        .select("id")
        .eq("slug", data.industryId)
        .single();

      // Create company
      const slug = data.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: data.companyName,
          slug: slug + "-" + Date.now().toString(36),
          phone: data.phone,
          city: data.city,
          state: data.state,
          industry_id: industry?.id,
          email: user.email,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Link user to company
      const { error: linkError } = await supabase.from("company_users").insert({
        company_id: company.id,
        user_id: user.id,
        role: "owner",
      });

      if (linkError) throw linkError;

      // Create company settings
      await supabase.from("company_settings").insert({
        company_id: company.id,
        lead_email: user.email,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  s <= step
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-neutral-200 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Tell us about your business
              </h1>
              <p className="text-neutral-600 mb-6">
                We'll use this to set up your account
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) =>
                      setData({ ...data, companyName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Pro Carpet Care"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Phone *
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData({ ...data, city: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Denver"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) =>
                        setData({ ...data, state: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="CO"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!data.companyName || !data.phone || !data.city || !data.state}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                What industry are you in?
              </h1>
              <p className="text-neutral-600 mb-6">
                This determines your per-lead pricing
              </p>

              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setData({ ...data, industryId: ind.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      data.industryId === ind.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="text-2xl">{ind.icon}</span>
                    <p className="font-medium text-neutral-900 mt-1">{ind.name}</p>
                    <p className="text-sm text-primary-600">${ind.price}/lead</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!data.industryId}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                You're all set!
              </h1>
              <p className="text-neutral-600 mb-6">
                Review your info and let's get started
              </p>

              <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Business</span>
                  <span className="font-medium">{data.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phone</span>
                  <span className="font-medium">{data.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Location</span>
                  <span className="font-medium">
                    {data.city}, {data.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Industry</span>
                  <span className="font-medium">
                    {industries.find((i) => i.id === data.industryId)?.name}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-neutral-600">Price per lead</span>
                  <span className="font-bold text-primary-600">
                    ${industries.find((i) => i.id === data.industryId)?.price}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-neutral-200 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Launch My Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
