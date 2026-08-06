"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TVUsernameForm() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/user/update-tv-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update username");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. trader_john99" 
          className="flex-1 bg-card border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#00D4FF] focus:outline-none transition-shadow"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#00D4FF] hover:bg-[#00B3D6] text-background font-bold px-8 py-3 rounded-lg text-sm transition-colors shadow-lg shadow-[#00D4FF]/20 whitespace-nowrap disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Username"}
        </button>
      </div>
    </form>
  );
}
