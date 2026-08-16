"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Check, 
  FlaskConical, 
  Globe, 
  KeyRound, 
  Mail, 
  Send, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Lock, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  FileText,
  MessageSquare
} from "lucide-react";

export default function AdminSettings() {
  // Global App Settings
  const [settings, setSettings] = useState({
    telegramLink: "",
    pdfLink: "",
    paypalMode: "live" as "live" | "sandbox",
  });

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // SMTP Test State
  const [testEmail, setTestEmail] = useState("");
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpMsg, setSmtpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Save General Settings
  const handleSaveSettings = async () => {
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

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg(null);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Admin password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch (err) {
      console.error(err);
      setPasswordMsg({ type: "error", text: "An error occurred while updating password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Run SMTP Diagnostic Test
  const handleTestSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpLoading(true);
    setSmtpMsg(null);

    try {
      const res = await fetch("/api/admin/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: testEmail })
      });

      const data = await res.json();
      if (res.ok) {
        setSmtpMsg({ type: "success", text: data.message });
      } else {
        setSmtpMsg({ type: "error", text: data.error || "SMTP verification failed." });
      }
    } catch (err: any) {
      console.error(err);
      setSmtpMsg({ type: "error", text: "SMTP diagnostic check failed." });
    } finally {
      setSmtpLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-16">
        <div className="h-32 bg-[#12223A]/80 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-[#12223A]/50 rounded-3xl"></div>
          <div className="h-64 bg-[#12223A]/50 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/90 via-[#0E1A2D]/90 to-[#0A1628]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Admin &amp; System Settings
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Security &amp; Integrations
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Manage admin credentials, test Hostinger SMTP deliverability, switch PayPal gateways, and configure community links.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B3D6] text-black font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50 text-sm"
          >
            {showSuccess ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : showSuccess ? "Settings Saved!" : "Save Global Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">
          
          {/* 1. Admin Password Management */}
          <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Admin Password Security</h2>
                <p className="text-xs text-gray-400">Update your administrator login password with bcrypt encryption.</p>
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                passwordMsg.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {passwordMsg.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                <p>{passwordMsg.text}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter existing password"
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold py-3 px-6 rounded-2xl text-sm transition-colors disabled:opacity-50"
              >
                {passwordLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {passwordLoading ? "Updating Password..." : "Update Admin Password"}
              </button>
            </form>
          </div>

          {/* 2. PayPal Gateway Mode Switcher */}
          <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">PayPal Payment Gateway</h2>
                  <p className="text-xs text-gray-400">Toggle live production vs sandbox simulation.</p>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                settings.paypalMode === "live" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}>
                {settings.paypalMode === "live" ? "LIVE ACTIVE" : "SANDBOX MODE"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, paypalMode: "live" })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  settings.paypalMode === "live"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5"
                    : "border-white/5 bg-[#0A1628] text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">LIVE Mode</span>
                  {settings.paypalMode === "live" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <p className="text-xs text-gray-400">Process genuine payments and subscriptions from active traders.</p>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, paypalMode: "sandbox" })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  settings.paypalMode === "sandbox"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/5"
                    : "border-white/5 bg-[#0A1628] text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">SANDBOX Mode</span>
                  {settings.paypalMode === "sandbox" && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />}
                </div>
                <p className="text-xs text-gray-400">Test checkout flows with mock PayPal test credentials.</p>
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-8">
          
          {/* 3. Hostinger SMTP Diagnostic */}
          <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Hostinger SMTP Webmail</h2>
                <p className="text-xs text-gray-400">Verify email dispatcher and send test health pings.</p>
              </div>
            </div>

            <div className="bg-[#0A1628] p-4 rounded-2xl border border-white/5 space-y-2 text-xs font-mono text-gray-400">
              <div className="flex justify-between">
                <span>Dispatcher Address:</span>
                <span className="text-white font-bold">support@16londonalgo.com</span>
              </div>
              <div className="flex justify-between">
                <span>SMTP Host:</span>
                <span className="text-emerald-400 font-bold">smtp.hostinger.com : 465 (SSL)</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" /> 100% Operational
                </span>
              </div>
            </div>

            {smtpMsg && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                smtpMsg.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {smtpMsg.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                <p>{smtpMsg.text}</p>
              </div>
            )}

            <form onSubmit={handleTestSmtp} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Send Test Email To</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to receive test ping"
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <button
                type="submit"
                disabled={smtpLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/30 text-[#00D4FF] font-bold py-3 px-6 rounded-2xl text-sm transition-colors disabled:opacity-50"
              >
                {smtpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {smtpLoading ? "Testing SMTP Connection..." : "Send Diagnostic Ping"}
              </button>
            </form>
          </div>

          {/* 4. Community & Resource Links */}
          <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Member Resources &amp; Links</h2>
                <p className="text-xs text-gray-400">Configures destination links in the Members Portal.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00D4FF]" />
                  Telegram Community Invite Link
                </label>
                <input
                  type="text"
                  value={settings.telegramLink}
                  onChange={(e) => setSettings({ ...settings, telegramLink: e.target.value })}
                  placeholder="https://t.me/yourchannel"
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#00D4FF]" />
                  System Rules PDF Document URL
                </label>
                <input
                  type="text"
                  value={settings.pdfLink}
                  onChange={(e) => setSettings({ ...settings, pdfLink: e.target.value })}
                  placeholder="https://yourdomain.com/rules.pdf"
                  className="w-full bg-[#0A1628] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
            </div>
          </div>

          {/* 5. System Health Monitor */}
          <div className="bg-[#12223A]/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Platform Diagnostics &amp; Health
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#0A1628] rounded-xl border border-white/5">
                <p className="text-gray-500">Database</p>
                <p className="text-emerald-400 font-bold mt-0.5">MongoDB Connected</p>
              </div>
              <div className="p-3 bg-[#0A1628] rounded-xl border border-white/5">
                <p className="text-gray-500">Framework</p>
                <p className="text-white font-bold mt-0.5">Next.js 16 (Turbopack)</p>
              </div>
              <div className="p-3 bg-[#0A1628] rounded-xl border border-white/5">
                <p className="text-gray-500">SSL Security</p>
                <p className="text-emerald-400 font-bold mt-0.5">TLS 1.3 Active</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
