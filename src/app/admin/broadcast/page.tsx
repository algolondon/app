"use client";

import { useState } from "react";
import { Mail, Send, AlertCircle, Users, Loader2, ShieldAlert } from "lucide-react";

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Custom confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSend = async (isTest: boolean) => {
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Subject and content are required." });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setShowConfirmModal(false);

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

      <div className="bg-[#12223A] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="broadcast-subject" className="text-sm font-medium text-gray-400">Email Subject</label>
          <input
            id="broadcast-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Important Update: New Indicator Added!"
            className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="broadcast-content" className="text-sm font-medium text-gray-400">Message Content (HTML Allowed)</label>
          <div className="text-xs text-gray-500 mb-2">
            You can write normal text, or use HTML tags like &lt;b&gt;, &lt;br&gt;, and &lt;a href="..."&gt; for advanced formatting.
          </div>
          <textarea
            id="broadcast-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hello,&#10;&#10;We have just released a massive update..."
            rows={10}
            className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors font-mono text-sm resize-y"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => handleSend(true)}
            disabled={isLoading || !subject || !content}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Send Test to Admin
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isLoading || !subject || !content}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00D4FF] text-[#0A1628] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[#00D4FF]/25"
          >
            <Users className="w-5 h-5" />
            Broadcast to All Users
          </button>
        </div>
      </div>

      {/* ── CUSTOM BROADCAST CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#0F1C30]">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Confirm Broadcast</h2>
                <p className="text-gray-400 text-xs mt-0.5">This action will email all registered members.</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Are you sure you want to broadcast this email to <span className="text-[#00D4FF] font-semibold">ALL users</span> in the system? This action cannot be canceled or undone once started.
              </p>
              <div className="bg-[#0A1628] p-3 rounded-xl border border-white/5 font-mono text-xs text-gray-400 line-clamp-2">
                <strong>Subject:</strong> {subject}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0F1C30] flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSend(false)}
                className="px-5 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8e0] text-black font-bold transition-colors text-sm flex items-center gap-2"
              >
                Yes, Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
