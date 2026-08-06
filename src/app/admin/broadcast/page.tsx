"use client";

import { useState } from "react";
import { Mail, Send, AlertCircle, Users } from "lucide-react";

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSend = async (isTest: boolean) => {
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Subject and content are required." });
      return;
    }

    if (!isTest && !confirm("Are you sure you want to broadcast this email to ALL registered users? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, isTest }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: isTest ? "Test email sent to Admin successfully!" : `Broadcast sent to ${data.count} users successfully!` 
        });
        if (!isTest) {
          setSubject("");
          setContent("");
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send email." });
      }
    } catch (error) {
      console.error("Broadcast error:", error);
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-[#00D4FF]" />
          Broadcast Email
        </h1>
      </div>

      <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Email Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Important Update: New Indicator Added!"
            className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Message Content (HTML Allowed)</label>
          <div className="text-xs text-gray-500 mb-2">
            You can write normal text, or use HTML tags like &lt;b&gt;, &lt;br&gt;, and &lt;a href="..."&gt; for advanced formatting.
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hello,&#10;&#10;We have just released a massive update..."
            rows={10}
            className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors font-mono text-sm resize-y"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => handleSend(true)}
            disabled={isLoading || !subject || !content}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            Send Test to Admin
          </button>
          <button
            onClick={() => handleSend(false)}
            disabled={isLoading || !subject || !content}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00D4FF] text-[#0A1628] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
          >
            <Users className="w-5 h-5" />
            Broadcast to All Users
          </button>
        </div>
      </div>
    </div>
  );
}
