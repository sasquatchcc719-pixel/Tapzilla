"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authButton, authInput, authLabel } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") ? next : "/dashboard");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Your taps have been busy.">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className={authLabel}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={authInput}
          />
        </div>
        <div>
          <label className={authLabel}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={authInput}
          />
        </div>
        <div className="text-right">
          <Link href="/auth/forgot-password" className="text-sm text-primary-300 hover:underline">
            Forgot password?
          </Link>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button disabled={loading} className={authButton}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/55">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-primary-300 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
