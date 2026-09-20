"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminGate() {
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
        setError("—");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-5">
      <form onSubmit={onSubmit} className="grid w-full max-w-xs gap-3">
        <label className="grid gap-2 text-sm text-neutral-400" htmlFor="password">
          <span className="sr-only">Password</span>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
            required
          />
        </label>
        {error ? (
          <p className="text-xs text-neutral-500" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="border border-neutral-700 px-3 py-2 text-sm text-neutral-300 disabled:opacity-60"
        >
          →
        </button>
      </form>
    </div>
  );
}
