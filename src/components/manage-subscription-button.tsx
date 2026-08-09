"use client";

import { useState } from "react";
interface ManageSubscriptionButtonProps {
  paypalSubscriptionId?: string | null;
}

export function ManageSubscriptionButton({ paypalSubscriptionId }: ManageSubscriptionButtonProps) {
  if (paypalSubscriptionId) {
    return (
      <a
        href="https://www.paypal.com/myaccount/autopay/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
      >
        Manage Subscription (PayPal)
      </a>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">No active subscription found.</p>
  );
}
