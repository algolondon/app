"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export function TVUsernameForm() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your TradingView username");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/user/update-tv-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update username");
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl">
        <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold text-sm">Username saved!</p>
          <p className="text-xs text-green-400/70">Kazi will grant you indicator access within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="TradingView username form">
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg" role="alert">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="tv-username" className="sr-only">TradingView Username</label>
          <input
            id="tv-username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            placeholder="e.g. trader_john99"
            aria-label="TradingView Username"
            aria-required="true"
            className="w-full bg-card border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#00D4FF] focus:outline-none transition-shadow"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00D4FF] hover:bg-[#00B3D6] text-[#0A1628] font-bold px-8 py-3 rounded-lg text-sm transition-colors shadow-lg shadow-[#00D4FF]/20 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Submit Username"}
        </button>
      </div>
    </form>
  );
}
