"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Save, 
  Check, 
  Palette, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  CreditCard, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  Undo2,
  BookOpen
} from "lucide-react";

export interface SiteContentData {
  marqueeText: string;
  tagline: string;
  heroTitle: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  heroYearsTrading: string;
  heroRevenue: string;
  heroNumberOfAlgos: string;

  trendAlgoTitle: string;
  trendAlgoDesc: string;
  trendAlgoBadge: string;
  londonXTitle: string;
  londonXDesc: string;
  atmSystemTitle: string;
  atmSystemDesc: string;

  rules: string[];
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderStoryButtonText: string;

  tier1Price: string;
  tier1Features: string[];
  tier2Price: string;
  tier2Features: string[];
  tier3Price: string;
  tier3Features: string[];

  faqs: Array<{ q: string; a: string }>;

  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;

  announcementActive: boolean;
  announcementText: string;
  announcementLink: string;
}

interface Props {
  initialContent: SiteContentData;
}

export function LiveVisualCustomizer({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContentData>(initialContent);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeAccordion, setActiveAccordion] = useState<string>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Broadcast real-time edits to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "UPDATE_CONTENT", content }, "*");
    }
  }, [content]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "UPDATE_CONTENT", content }, "*");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Accordion
  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? "" : section);
  };

  // Save to Database
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      if (!res.ok) throw new Error("Failed to save");
      showToast("Changes published live to 16London website!");
    } catch (error) {
      console.error(error);
      showToast("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // FAQ Management
  const handleAddFaq = () => {
    setContent({
      ...content,
      faqs: [...content.faqs, { q: "New Question Here", a: "Answer text goes here." }]
    });
  };

  const handleUpdateFaq = (index: number, field: "q" | "a", value: string) => {
    const updated = [...content.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, faqs: updated });
  };

  const handleDeleteFaq = (index: number) => {
    setContent({
      ...content,
      faqs: content.faqs.filter((_, i) => i !== index)
    });
  };

  // Rules Management
  const handleUpdateRule = (index: number, val: string) => {
    const updated = [...content.rules];
    updated[index] = val;
    setContent({ ...content, rules: updated });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -mt-4 -mb-8 -mx-4 md:-mx-8 overflow-hidden bg-[#050B14]">
      
      {/* ── TOP CONTROL BAR ── */}
      <div className="h-16 bg-[#0A1628] border-b border-white/10 px-6 flex items-center justify-between shrink-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Live Visual Customizer
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Elementor Engine
              </span>
            </h1>
            <p className="text-[11px] text-gray-400 hidden sm:block">Edit sections on the left, see instant live rendering on the right.</p>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-[#12223A] border border-white/10 rounded-2xl">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deviceMode === "desktop" ? "bg-[#00D4FF] text-black font-bold shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deviceMode === "tablet" ? "bg-[#00D4FF] text-black font-bold shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet (768px)
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deviceMode === "mobile" ? "bg-[#00D4FF] text-black font-bold shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile (375px)
          </button>
        </div>

        {/* Right: Publish Button */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live Site
          </a>

          <button
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B3D6] text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all text-xs sm:text-sm disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Publishing..." : "Publish to Live Site"}
          </button>
        </div>
      </div>

      {/* ── SPLIT VIEW WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT PANEL: SECTION ACCORDIONS (40% width) ── */}
        <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#0A1628] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto z-20 shadow-2xl">
          <div className="p-4 space-y-3">
            
            {/* 1. Hero & Marquee Accordion */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("hero")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                  <span>Hero Section &amp; Ticker</span>
                </div>
                {activeAccordion === "hero" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "hero" && (
                <div className="p-4 pt-0 space-y-4 border-t border-white/5 bg-[#0A1628]/50">
                  <div className="space-y-1.5 pt-3">
                    <label className="text-xs font-semibold text-gray-300">Marquee Ticker Text</label>
                    <textarea
                      value={content.marqueeText}
                      onChange={(e) => setContent({ ...content, marqueeText: e.target.value })}
                      rows={2}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Badge Pill Text</label>
                    <input
                      type="text"
                      value={content.tagline}
                      onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Main Title (Line 1)</label>
                    <input
                      type="text"
                      value={content.heroTitle}
                      onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Gradient Title (Line 2)</label>
                    <input
                      type="text"
                      value={content.heroTitleGradient}
                      onChange={(e) => setContent({ ...content, heroTitleGradient: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Hero Subtitle</label>
                    <textarea
                      value={content.heroSubtitle}
                      onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                      rows={3}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Years Stat</label>
                      <input
                        type="text"
                        value={content.heroYearsTrading}
                        onChange={(e) => setContent({ ...content, heroYearsTrading: e.target.value })}
                        className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Revenue Stat</label>
                      <input
                        type="text"
                        value={content.heroRevenue}
                        onChange={(e) => setContent({ ...content, heroRevenue: e.target.value })}
                        className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Algos Stat</label>
                      <input
                        type="text"
                        value={content.heroNumberOfAlgos}
                        onChange={(e) => setContent({ ...content, heroNumberOfAlgos: e.target.value })}
                        className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Three Systems Accordion */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("systems")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>The 3 Trading Systems</span>
                </div>
                {activeAccordion === "systems" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "systems" && (
                <div className="p-4 pt-0 space-y-4 border-t border-white/5 bg-[#0A1628]/50">
                  <div className="space-y-2 pt-3">
                    <p className="text-xs font-bold text-[#00D4FF]">System 1: Trend Algo</p>
                    <input
                      type="text"
                      value={content.trendAlgoTitle}
                      onChange={(e) => setContent({ ...content, trendAlgoTitle: e.target.value })}
                      placeholder="Title"
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                    <textarea
                      value={content.trendAlgoDesc}
                      onChange={(e) => setContent({ ...content, trendAlgoDesc: e.target.value })}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-xs font-bold text-purple-400">System 2: London X</p>
                    <input
                      type="text"
                      value={content.londonXTitle}
                      onChange={(e) => setContent({ ...content, londonXTitle: e.target.value })}
                      placeholder="Title"
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                    <textarea
                      value={content.londonXDesc}
                      onChange={(e) => setContent({ ...content, londonXDesc: e.target.value })}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-xs font-bold text-yellow-400">System 3: ATM System</p>
                    <input
                      type="text"
                      value={content.atmSystemTitle}
                      onChange={(e) => setContent({ ...content, atmSystemTitle: e.target.value })}
                      placeholder="Title"
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                    <textarea
                      value={content.atmSystemDesc}
                      onChange={(e) => setContent({ ...content, atmSystemDesc: e.target.value })}
                      placeholder="Description"
                      rows={2}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. The 4 Golden Rules & About Kazi */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("rules")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>The 4 Golden Rules &amp; About</span>
                </div>
                {activeAccordion === "rules" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "rules" && (
                <div className="p-4 pt-0 space-y-3 border-t border-white/5 bg-[#0A1628]/50">
                  <p className="text-xs font-bold text-gray-300 pt-3">The 4 Rules:</p>
                  {content.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#00D4FF]">#{idx + 1}</span>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(idx, e.target.value)}
                        className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                  ))}

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <label className="text-xs font-bold text-gray-300">About Founder Bio</label>
                    <textarea
                      value={content.founderBio}
                      onChange={(e) => setContent({ ...content, founderBio: e.target.value })}
                      rows={4}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Pricing Tiers Accordion */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("pricing")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Subscription Pricing Tiers</span>
                </div>
                {activeAccordion === "pricing" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "pricing" && (
                <div className="p-4 pt-0 space-y-4 border-t border-white/5 bg-[#0A1628]/50">
                  <div className="space-y-1.5 pt-3">
                    <label className="text-xs font-bold text-blue-400">Tier 1 Monthly Price ($)</label>
                    <input
                      type="text"
                      value={content.tier1Price}
                      onChange={(e) => setContent({ ...content, tier1Price: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-400">Tier 2 Monthly Price ($)</label>
                    <input
                      type="text"
                      value={content.tier2Price}
                      onChange={(e) => setContent({ ...content, tier2Price: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-yellow-400">Tier 3 Monthly Price ($)</label>
                    <input
                      type="text"
                      value={content.tier3Price}
                      onChange={(e) => setContent({ ...content, tier3Price: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. FAQs Accordion */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("faqs")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Frequently Asked Questions ({content.faqs.length})</span>
                </div>
                {activeAccordion === "faqs" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "faqs" && (
                <div className="p-4 pt-0 space-y-4 border-t border-white/5 bg-[#0A1628]/50">
                  <div className="pt-3 space-y-3">
                    {content.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-[#12223A] p-3 rounded-xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#00D4FF]">Question #{idx + 1}</span>
                          <button
                            onClick={() => handleDeleteFaq(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                          placeholder="Question"
                          className="w-full bg-[#0A1628] border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                        <textarea
                          value={faq.a}
                          onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                          placeholder="Answer"
                          rows={2}
                          className="w-full bg-[#0A1628] border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    ))}

                    <button
                      onClick={handleAddFaq}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New FAQ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Announcement & CTA Accordion */}
            <div className="bg-[#12223A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-md">
              <button
                onClick={() => toggleAccordion("cta")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Call to Action Banner</span>
                </div>
                {activeAccordion === "cta" ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>

              {activeAccordion === "cta" && (
                <div className="p-4 pt-0 space-y-3 border-t border-white/5 bg-[#0A1628]/50">
                  <div className="space-y-1.5 pt-3">
                    <label className="text-xs font-semibold text-gray-300">CTA Main Headline</label>
                    <input
                      type="text"
                      value={content.ctaTitle}
                      onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">CTA Subtitle</label>
                    <input
                      type="text"
                      value={content.ctaSubtitle}
                      onChange={(e) => setContent({ ...content, ctaSubtitle: e.target.value })}
                      className="w-full bg-[#12223A] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── RIGHT PANEL: LIVE REACTIVE PREVIEW (60% width) ── */}
        <div className="flex-1 bg-[#050B14] p-4 md:p-6 overflow-y-auto flex flex-col items-center justify-start relative">
          
          {/* Simulated Browser Frame */}
          <div 
            className={`
              transition-all duration-300 bg-[#050B14] border border-white/15 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col
              ${deviceMode === "desktop" ? "w-full" : ""}
              ${deviceMode === "tablet" ? "w-[768px] max-w-full" : ""}
              ${deviceMode === "mobile" ? "w-[375px] max-w-full" : ""}
            `}
          >
            {/* Browser Top Bar */}
            <div className="bg-[#0A1628] border-b border-white/10 px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>

              <div className="bg-[#12223A] px-6 py-1 rounded-full border border-white/5 text-[11px] font-mono text-gray-400 flex items-center gap-2">
                <span className="text-emerald-400">🔒</span>
                <span>https://16londonalgo.com</span>
                <span className="text-[10px] text-[#00D4FF] font-sans font-bold">● Live Preview</span>
              </div>

              <div className="text-[11px] text-gray-500 font-mono">
                {deviceMode.toUpperCase()}
              </div>
            </div>

            {/* Live Reactive Iframe Preview */}
            <div className="flex-1 bg-background text-foreground overflow-hidden h-[calc(100vh-14rem)] w-full">
              <iframe 
                ref={iframeRef}
                src="/?preview=customizer"
                onLoad={handleIframeLoad}
                title="Live Site Preview"
                className="w-full h-full border-0 bg-[#050B14]"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00D4FF] text-[#050B14] font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.5)] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 stroke-[3]" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
