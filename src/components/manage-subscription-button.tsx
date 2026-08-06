"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export function ManageSubscriptionButton({ stripeCustomerId }: { stripeCustomerId?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManage = async () => {
    setError(null);
    if (!stripeCustomerId) {
      setError("No active Stripe subscription found.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to load billing portal");
      }
    } catch (err) {
      console.error("Portal error", err);
      setError("Failed to load billing portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <button 
        onClick={handleManage}
        disabled={loading || !stripeCustomerId}
        className={`w-full flex items-center justify-center gap-2 bg-background hover:bg-foreground/5 text-foreground text-sm font-bold py-3 rounded-lg transition-colors border border-foreground/10 hover:border-foreground/20 ${!stripeCustomerId ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Loading..." : "Manage Subscription"} <ExternalLink className="w-4 h-4" />
      </button>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
