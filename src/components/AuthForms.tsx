"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { safePath } from "@/lib/redirect";

async function signInWithCredentials(email: string, password: string) {
  const res = await signIn("credentials", { email, password, redirect: false });
  return !res?.error;
}

function Shell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <main className="wrap grid place-items-center py-16">
      <div className="card glow w-full max-w-md p-8">
        <p className="eyebrow">Welcome</p>
        <h1 className="display mt-2 text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </div>
    </main>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const target = safePath(callbackUrl);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await signInWithCredentials(email, password);
    if (!ok) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }
    router.push(target);
    router.refresh();
  }

  return (
    <Shell
      title="Sign in"
      subtitle="Welcome back. Enter your details to continue."
      footer={<>New here? <Link className="text-accent hover:underline" href={`/register?callbackUrl=${encodeURIComponent(target)}`}>Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" autoComplete="current-password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />} Sign in
        </button>
      </form>
    </Shell>
  );
}

export function RegisterForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const target = safePath(callbackUrl);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        setLoading(false);
        return;
      }

      const ok = await signInWithCredentials(form.email, form.password);
      router.push(ok ? target : "/login");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Shell
      title="Create your account"
      subtitle="Track orders and check out faster."
      footer={<>Already have an account? <Link className="text-accent hover:underline" href={`/login?callbackUrl=${encodeURIComponent(target)}`}>Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="label">Username</label>
          <input id="username" autoComplete="username" required minLength={3} maxLength={20} pattern="[a-zA-Z0-9_]+" title="Letters, numbers and underscores" className="field" value={form.username} onChange={set("username")} />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" autoComplete="email" required className="field" value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" autoComplete="new-password" required minLength={8} className="field" value={form.password} onChange={set("password")} />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />} Create account
        </button>
      </form>
    </Shell>
  );
}
