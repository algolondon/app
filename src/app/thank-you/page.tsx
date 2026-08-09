"use client";

import { motion } from "framer-motion";
import { CheckCircle, Hourglass, ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0A1628] text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 relative z-10 pt-32 pb-24 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D4FF] blur-[150px] opacity-10 rounded-full w-[600px] h-[600px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto px-6 w-full relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <CheckCircle className="w-24 h-24 text-green-500" aria-hidden="true" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            Payment Submitted! 🎉
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xl text-gray-400 mb-12">
              Thank you for subscribing to 16London X Brands LLC
            </p>

            <div className="bg-[#12223A] border border-white/10 rounded-2xl p-8 mb-8 text-left shadow-[0_0_30px_rgba(0,212,255,0.05)]">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-green-400">
                  <CheckCircle className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-lg">Step 1: Account Created</span>
                </div>
                <div className="flex items-center gap-4 text-green-400">
                  <CheckCircle className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-lg">Step 2: Payment Verified Automatically</span>
                </div>
                <div className="flex items-center gap-4 text-green-400">
                  <CheckCircle className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-lg">Step 3: Account Activated Instantly</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <ArrowRight className="w-6 h-6 shrink-0 text-[#00D4FF]" aria-hidden="true" />
                  <span className="font-semibold text-lg text-white">Step 4: Start Trading!</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F1C30] p-6 rounded-xl border border-white/5 mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Your payment was verified automatically! You can now access the <strong>Members Portal</strong> and <strong>Course Library</strong>.
              </p>
              <div className="mt-6 flex justify-center">
                <Link href="/members-portal" className="bg-[#00D4FF] text-black font-bold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:bg-[#00b8e0] transition-colors">
                  Go to Members Portal
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <a href="https://t.me/+_JqY7DXwWpAxOGUx" target="_blank" rel="noopener noreferrer" className="bg-[#12223A] hover:bg-[#1A2D4C] border border-white/10 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Send className="w-5 h-5" aria-hidden="true" /> Join our Telegram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
