"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

export function SupportEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Also try to open the mailto link just in case they have a client
      window.location.href = `mailto:${email}`;
    } catch (err) {
      console.error("Failed to copy email", err);
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center gap-2 bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 px-6 py-2 rounded-full text-sm font-bold transition-all"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Email Copied!
        </>
      ) : (
        <>
          <Mail className="w-4 h-4" />
          {email}
        </>
      )}
    </button>
  );
}
