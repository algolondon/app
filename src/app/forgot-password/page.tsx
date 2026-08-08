"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#00D4FF 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D4FF] blur-[150px] opacity-10 rounded-full pointer-events-none z-0" />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            href="/login"
            className="inline-flex items-center text-muted-foreground hover:text-[#00D4FF] mb-8 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <div className="bg-card border border-[#00D4FF]/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,212,255,0.08)]">
            {/* Logo area */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground">Reset Password</h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Check Your Inbox</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If an account exists for <span className="text-[#00D4FF] font-medium">{email}</span>, we&apos;ve sent a password reset link. Check your spam folder if you don&apos;t see it.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-block text-sm text-[#00D4FF] hover:underline font-medium"
                >
                  Back to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background border border-foreground/10 rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] transition-all placeholder-muted-foreground"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#00D4FF] hover:bg-[#00B3D6] text-[#0A1628] font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
