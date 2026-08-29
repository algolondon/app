"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Send, Sparkles, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { TVUsernameForm } from "@/components/TVUsernameForm";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0A1628] text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 relative z-10 pt-28 pb-20 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D4FF] blur-[150px] opacity-10 rounded-full w-[600px] h-[600px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto px-6 w-full relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-500" aria-hidden="true" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-display font-bold mb-3"
          >
            Payment Successful! 🎉
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-base text-gray-400 mb-8">
              Welcome to 16London Algo. Your subscription is officially active.
            </p>

            {/* TRADINGVIEW USERNAME SUBMISSION BOX - PROMINENT STEP */}
            <div className="bg-[#12223A] border-2 border-[#00D4FF]/40 rounded-2xl p-6 sm:p-8 mb-8 text-left shadow-[0_0_40px_rgba(0,212,255,0.15)] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#00D4FF] shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Required: Enter Your TradingView Username</h2>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
                Enter your exact TradingView username below so Kazi can grant invite-only indicator access to your account within 24 hours.
              </p>
              
              <TVUsernameForm />
            </div>

            {/* Steps checklist */}
            <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-6 mb-8 text-left shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-400 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-semibold">Step 1: Account Created & Verified</span>
                </div>
                <div className="flex items-center gap-3 text-green-400 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-semibold">Step 2: PayPal Subscription Active</span>
                </div>
                <div className="flex items-center gap-3 text-green-400 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-semibold">Step 3: Members Portal & Courses Unlocked</span>
                </div>
                <div className="flex items-center gap-3 text-[#00D4FF] text-sm">
                  <ArrowRight className="w-5 h-5 shrink-0 text-[#00D4FF]" aria-hidden="true" />
                  <span className="font-semibold text-white">Step 4: Indicators Added to Your Chart</span>
                </div>
              </div>
            </div>

            {/* Direct Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Link 
                href="/members-portal" 
                className="bg-[#00D4FF] hover:bg-[#00B3D6] text-black font-bold px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Layers className="w-4 h-4" /> Go to Members Portal
              </Link>
              <Link 
                href="/course-library" 
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen className="w-4 h-4 text-[#00D4FF]" /> Open Course Library
              </Link>
            </div>

            {/* Telegram Community */}
            <div className="flex justify-center">
              <a 
                href="https://t.me/+_JqY7DXwWpAxOGUx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#12223A] hover:bg-[#1A2D4C] border border-white/10 text-gray-300 hover:text-white text-xs font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-[#00D4FF]" aria-hidden="true" /> Join VIP Telegram Community
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
