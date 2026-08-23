"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const wantsAuthor = params.get("role") === "AUTHOR";

  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, emailConsent: consent }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create account.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    // If they came to publish, send them to the author application; else home.
    router.push(wantsAuthor ? "/become-author" : "/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-ink px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link href="/" className="mb-6 block text-center font-serif text-2xl font-bold text-brand">
          Scratch<span className="text-ink">Book</span>
        </Link>
        <h1 className="text-center text-xl font-semibold">Create your account</h1>

        {wantsAuthor && (
          <p className="mt-4 rounded-lg bg-brand-tint px-3 py-2 text-xs text-brand">
            After creating your free account, you&apos;ll complete a short author application (details +
            manuscript) for our team to review.
          </p>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          <GoogleButton callbackUrl={wantsAuthor ? "/become-author" : "/"} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div>
            <label className="label">Mobile</label>
            <input className="input" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} />
          </div>
          <label className="flex items-start gap-2 text-xs text-ink/60">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
            I agree to receive emails and updates from ScratchBook Publications (offers, new releases,
            order updates). You can unsubscribe anytime.
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account? <Link href="/login" className="font-semibold text-brand">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
