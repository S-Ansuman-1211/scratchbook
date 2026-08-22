"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get("role") === "AUTHOR" ? "AUTHOR" : "CUSTOMER";

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: initialRole as "CUSTOMER" | "AUTHOR",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

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
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not create account.");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration (account is a customer for now).
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    // Authors are approved by an admin - show a pending note instead of the dashboard.
    if (data.pendingAuthor) {
      setApplied(true);
      setLoading(false);
      router.refresh();
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (applied) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-ink px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">
            ✓
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Author application submitted</h1>
          <p className="mt-2 text-sm text-ink/70">
            Thanks, {form.name || "there"}! Your account is active and you can shop right away.
            Our team will review your author request - once approved, your{" "}
            <strong>Author Dashboard</strong> unlocks and you can start publishing.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/books" className="btn-primary w-full">Browse books</Link>
            <Link href="/" className="btn-outline w-full">Go to homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-ink px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link href="/" className="mb-6 block text-center font-serif text-2xl font-bold text-brand">
          Scratch<span className="text-ink">Book</span>
        </Link>
        <h1 className="text-center text-xl font-semibold">Create your account</h1>

        {/* Role toggle: Customer vs Author */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-cream p-1">
          {(["CUSTOMER", "AUTHOR"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update("role", r)}
              className={`rounded-md py-2 text-sm font-semibold transition ${
                form.role === r ? "bg-brand text-white" : "text-ink/60"
              }`}
            >
              {r === "CUSTOMER" ? "Customer" : "Author"}
            </button>
          ))}
        </div>

        {form.role === "AUTHOR" && (
          <p className="mt-3 rounded-lg bg-brand-tint px-3 py-2 text-xs text-brand">
            Author accounts are reviewed by our team. You&apos;ll register as a member now and get
            author access (and your dashboard) once approved.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand">Login</Link>
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
