"use client";

import { useState } from "react";
import { 
  Mail, 
  Send, 
  AlertCircle, 
  Users, 
  Loader2, 
  ShieldAlert, 
  FileText, 
  Tag, 
  Link2, 
  Sparkles, 
  Eye, 
  Check, 
  Smartphone, 
  Monitor,
  Flame,
  Bell
} from "lucide-react";

export default function BroadcastPage() {
  const [subject, setSubject] = useState("Exclusive 16London Trading Update");
  const [content, setContent] = useState(
    `Hey Trader,\n\nWe've just pushed a major algorithm upgrade to the 16London Indicator Suite.\n\nMake sure to refresh your TradingView charts to automatically receive the newest signal accuracy enhancements.\n\nBest regards,\nKazi (Founder, 16London Algo)`
  );
  const [targetAudience, setTargetAudience] = useState<"all" | "active" | "abandoned">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<"custom" | "abandoned_cart" | "update_alert">("custom");
  const [couponCode, setCouponCode] = useState("LONDON15");
  const [buttonUrl, setButtonUrl] = useState("https://16londonalgo.com/checkout?tier=1&coupon=LONDON15");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleTemplateChange = (template: "custom" | "abandoned_cart" | "update_alert") => {
    setSelectedTemplate(template);
    if (template === "custom") {
      setSubject("");
      setContent("");
    } else if (template === "abandoned_cart") {
      setSubject("Complete your 16London Algo setup (15% Off Code Inside)");
      setTargetAudience("abandoned");
      setCouponCode("LONDON15");
      setButtonUrl("https://16londonalgo.com/checkout?tier=1&coupon=LONDON15");
      setContent(
        `Hey there,\n\nWe noticed you started setting up your 16London Algo account but didn't complete your subscription.\n\nConsistently profitable trading requires the right tools. To help you get started, we've created a special one-time discount code for you.\n\nUse this code at checkout to get 15% off your first month of any plan.\n\nIf you have any questions, reply directly to this email.\n\nBest regards,\nKazi (Founder, 16London Algo)`
      );
    } else if (template === "update_alert") {
      setSubject("🚨 Urgent Indicator Update: New Signals Added");
      setTargetAudience("active");
      setContent(
        `Hello Team,\n\nWe have updated the 16London Trend Algo with enhanced institutional volume detection.\n\nLog in to your Members Portal now to check out the new video walk-through and documentation.\n\nKeep your risk managed and trade with discipline!\n\nBest regards,\nKazi`
      );
    }
  };

  const handleSend = async (isTest: boolean) => {
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Subject and message content are required." });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setShowConfirmModal(false);

    try {
      const payload: any = { 
        subject, 
        content, 
        isTest, 
        targetAudience 
      };

      if (selectedTemplate === "abandoned_cart") {
        payload.couponCode = couponCode;
        payload.buttonUrl = buttonUrl;
      }

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: isTest ? "Test email sent to Admin successfully!" : `Broadcast dispatched to ${data.count} members!` 
        });
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

  const getAudienceLabel = (aud: typeof targetAudience) => {
    switch (aud) {
      case "all": return "All Registered Users";
      case "active": return "Active Members Only";
      case "abandoned": return "Checkout Drop-offs (Abandoned Cart)";
    }
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/90 via-[#0E1A2D]/90 to-[#0A1628]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Email Broadcast Suite
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mail className="w-3.5 h-3.5" />
              Direct Member Reach
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Dispatch announcements, promotional discounts, and system alerts with live email layout previewing.
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-5 rounded-3xl flex items-center gap-3 animate-in fade-in ${
          message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        }`}>
          {message.type === "error" ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
          <p className="font-bold text-sm">{message.text}</p>
        </div>
      )}

      {/* ── SPLIT SCREEN COMPOSER & PREVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Composer Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          {/* Audience & Template Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00D4FF]" />
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] text-sm cursor-pointer"
                disabled={isLoading}
              >
                <option value="all">All Registered Users</option>
                <option value="active">Active Members Only</option>
                <option value="abandoned">Abandoned Checkouts</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00D4FF]" />
                Template Preset
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as any)}
                className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF] text-sm cursor-pointer"
                disabled={isLoading}
              >
                <option value="custom">Custom / Blank Email</option>
                <option value="abandoned_cart">Abandoned Cart (15% Code)</option>
                <option value="update_alert">System / Indicator Update</option>
              </select>
            </div>
          </div>

          {/* Coupon Fields if abandoned cart */}
          {selectedTemplate === "abandoned_cart" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0A1628] border border-[#00D4FF]/20 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#00D4FF] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Coupon Code
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-[#12223A] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#00D4FF] flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" /> Button URL
                </label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  className="w-full bg-[#12223A] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Email Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important Indicator Upgrade for Members"
              className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00D4FF] text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Message Content Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Message Body *
              </label>
              <span className="text-xs text-gray-500 font-mono">{content.length} characters</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Write your email announcement here..."
              className="w-full bg-[#0A1628] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00D4FF] text-sm leading-relaxed font-sans resize-y"
              disabled={isLoading}
            />
          </div>

          {/* Send Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => handleSend(true)}
              disabled={isLoading || !subject.trim() || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Test to Admin
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isLoading || !subject.trim() || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-[#00B3D6] text-[#050B14] font-bold py-3.5 px-6 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all text-sm disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              Broadcast to {getAudienceLabel(targetAudience)}
            </button>
          </div>
        </div>

        {/* Right Column: Live Email Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#00D4FF]" />
              Live Inbox Preview
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#0A1628] border border-white/5 rounded-xl">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === "desktop" ? "bg-[#00D4FF]/20 text-[#00D4FF]" : "text-gray-400 hover:text-white"}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === "mobile" ? "bg-[#00D4FF]/20 text-[#00D4FF]" : "text-gray-400 hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Email Frame */}
          <div className={`mx-auto transition-all duration-300 ${previewDevice === "mobile" ? "max-w-[340px]" : "w-full"}`}>
            <div className="bg-[#050B14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Mail client mock bar */}
              <div className="bg-[#0A1628] p-3 border-b border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="truncate font-mono text-[11px] ml-2 text-gray-300 font-semibold">
                  {subject || "Subject preview..."}
                </span>
              </div>

              {/* Email Body */}
              <div className="p-6 space-y-6 text-white text-sm">
                
                {/* 16London Logo Header */}
                <div className="text-center pb-4 border-b border-white/10">
                  <span className="font-display font-extrabold text-lg text-white tracking-widest">
                    16LONDON <span className="text-[#00D4FF]">ALGO</span>
                  </span>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Institutional Trading Systems</p>
                </div>

                {/* Email Content */}
                <div className="text-gray-300 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {content || "Your message body will appear live here..."}
                </div>

                {/* Optional Coupon Callout if template selected */}
                {selectedTemplate === "abandoned_cart" && (
                  <div className="p-4 rounded-2xl bg-[#0A1628] border border-[#00D4FF]/30 text-center space-y-2">
                    <p className="text-[11px] text-gray-300 font-semibold">Use your one-time discount code:</p>
                    <div className="inline-block px-4 py-1.5 bg-[#00D4FF]/10 text-[#00D4FF] border border-dashed border-[#00D4FF] rounded-xl font-mono font-bold text-sm">
                      {couponCode}
                    </div>
                    <div className="pt-2">
                      <a
                        href={buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full py-2.5 px-4 bg-[#00D4FF] text-black font-bold text-xs rounded-xl shadow-lg"
                      >
                        Claim 15% Discount Now →
                      </a>
                    </div>
                  </div>
                )}

                {/* Email Footer */}
                <div className="pt-6 border-t border-white/10 text-center space-y-1 text-[10px] text-gray-500">
                  <p>16London X Brands LLC · Miami, FL</p>
                  <p>Sent via Hostinger SMTP Verified Dispatcher</p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── BROADCAST CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12223A] border border-white/15 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 md:p-8 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Confirm Broadcast Dispatch</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                You are about to broadcast this email to <span className="text-[#00D4FF] font-bold">{getAudienceLabel(targetAudience)}</span>.
              </p>
            </div>

            <div className="bg-[#0A1628] p-3.5 rounded-2xl border border-white/5 space-y-1 text-xs font-mono text-gray-400">
              <p><strong className="text-white">Subject:</strong> {subject}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSend(false)}
                className="px-5 py-2.5 bg-[#00D4FF] hover:bg-[#00B3D6] text-black font-bold rounded-xl text-sm transition-all shadow-lg"
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
