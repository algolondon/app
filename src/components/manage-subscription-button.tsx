"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export function ManageSubscriptionButton({ stripeCustomerId, paypalSubscriptionId }: { stripeCustomerId?: string | null, paypalSubscriptionId?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManage = async () => {
    setError(null);
    if (paypalSubscriptionId) {
      window.location.href = "https://www.paypal.com/myaccount/autopay/";
      return;
    }
    
    if (!stripeCustomerId) {
      setError("No active subscription found.");
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

  const hasSubscription = stripeCustomerId || paypalSubscriptionId;

  return (
    <div className="w-full flex flex-col gap-2">
      <button 
        onClick={handleManage}
        disabled={loading || !hasSubscription}
        className={`w-full flex items-center justify-center gap-2 bg-background hover:bg-foreground/5 text-foreground text-sm font-bold py-3 rounded-lg transition-colors border border-foreground/10 hover:border-foreground/20 ${!hasSubscription ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Loading..." : "Manage Subscription"} <ExternalLink className="w-4 h-4" />
      </button>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
