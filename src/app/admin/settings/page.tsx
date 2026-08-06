"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    telegramLink: "",
    pdfLink: "",
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
