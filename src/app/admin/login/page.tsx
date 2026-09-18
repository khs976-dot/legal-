"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error || "Unable to sign in.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="w-full max-w-md border border-gold/30 bg-navy-deep p-8 text-ivory">
        <p className="text-xs tracking-[0.22em] text-gold uppercase">
          Content dashboard / لوحة المحتوى
        </p>
        <h1 className="font-display mt-3 text-3xl">Sign in</h1>
        <p className="mt-3 text-sm leading-7 text-ivory/70">
          Enter the password from the <code className="text-gold-light">ADMIN_PASSWORD</code>{" "}
          environment variable. Arabic and English site text is edited after sign-in.
        </p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm" htmlFor="password">
            Password / كلمة المرور
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border border-gold/30 bg-navy px-4 py-3 text-ivory"
              required
            />
          </label>
          {error ? (
            <p className="text-sm text-gold-light" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="bg-gold px-5 py-3 text-sm tracking-[0.12em] text-navy-deep uppercase disabled:opacity-60"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
