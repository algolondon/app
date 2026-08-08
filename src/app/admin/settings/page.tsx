"use client";

import { useState, useEffect } from "react";
import { Save, Check, FlaskConical, Globe } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    telegramLink: "",
    pdfLink: "",
    paypalMode: "live" as "live" | "sandbox",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings({
        telegramLink: data.telegramLink || "",
        pdfLink: data.pdfLink || "",
        paypalMode: (data.paypalMode as "live" | "sandbox") || "live",
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00D4FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white">Global Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#00D4FF] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00D4FF]/90 transition-colors disabled:opacity-50"
        >
          {showSuccess ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saving..." : showSuccess ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* PayPal Mode Toggle */}
      <div className="bg-[#0A1628] rounded-2xl border border-white/10 p-6 max-w-3xl">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>PayPal Mode</span>
          {settings.paypalMode === "sandbox" ? (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-medium">SANDBOX (Testing)</span>
          ) : (
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">LIVE</span>
          )}
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Switch between Live (real payments) and Sandbox (testing with fake money). <br/>
          <span className="text-yellow-400">⚠️ Always switch back to LIVE before going live with customers!</span>
        </p>

        <div className="flex items-center gap-6">
          {/* Live Option */}
          <button
            onClick={() => setSettings({ ...settings, paypalMode: "live" })}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all w-full ${
              settings.paypalMode === "live"
                ? "border-green-500 bg-green-500/10 text-green-400"
                : "border-white/10 bg-[#050B14] text-gray-400 hover:border-white/30"
            }`}
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-sm">LIVE Mode</div>
              <div className="text-xs opacity-70">Real payments from customers</div>
            </div>
            {settings.paypalMode === "live" && (
              <div className="ml-auto w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            )}
          </button>

          {/* Sandbox Option */}
          <button
            onClick={() => setSettings({ ...settings, paypalMode: "sandbox" })}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all w-full ${
              settings.paypalMode === "sandbox"
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 bg-[#050B14] text-gray-400 hover:border-white/30"
            }`}
          >
            <FlaskConical className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-sm">SANDBOX Mode</div>
              <div className="text-xs opacity-70">Test with fake PayPal money</div>
            </div>
            {settings.paypalMode === "sandbox" && (
              <div className="ml-auto w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="bg-[#0A1628] rounded-2xl border border-white/10 p-6 space-y-6 max-w-3xl">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Telegram Community Link</label>
          <p className="text-xs text-gray-500 mb-2">This link is used in the "Telegram Community" button on the Members Portal.</p>
          <input
            type="text"
            value={settings.telegramLink}
            onChange={(e) => setSettings({ ...settings, telegramLink: e.target.value })}
            placeholder="https://t.me/..."
            className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">System Rules PDF Link</label>
          <p className="text-xs text-gray-500 mb-2">This link is used in the "System Rules PDF" button on the Members Portal.</p>
          <input
            type="text"
            value={settings.pdfLink}
            onChange={(e) => setSettings({ ...settings, pdfLink: e.target.value })}
            placeholder="https://..."
            className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
