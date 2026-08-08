"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen selection:bg-primary selection:text-foreground relative bg-background overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="fixed inset-0 bg-[#00D4FF] blur-3xl opacity-10 rounded-full w-[800px] h-[800px] top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transform-gpu"></div>

      <Navbar />

      <section className="relative pt-32 pb-24 z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#00D4FF] mb-12 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="bg-card border border-[#00D4FF]/20 rounded-3xl p-8 lg:p-12 shadow-[0_0_50px_rgba(0,212,255,0.05)] relative overflow-hidden"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl lg:text-5xl font-display font-bold mb-4">Meet Kazi</motion.h1>
            <motion.div variants={fadeInUp} className="inline-block bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-10">
              Founder of 16London Trend Algo
            </motion.div>

            <motion.div variants={fadeInUp} className="w-full mb-10 rounded-2xl overflow-hidden border border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.15)] relative">
              <Image src="/images/xauusd-chart.png" alt="XAUUSD 15 Min Example" width={1000} height={600} className="w-full h-auto object-cover" />
            </motion.div>

            <motion.div variants={fadeInUp} className="prose prose-invert prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-xl text-foreground font-medium">
                I'm Kaziyel, born and raised in Miami, Florida, and I've been trading and teaching the financial markets for over 8 years.
              </p>
              
              <p>
                When I first started trading, I spent countless hours studying charts, testing strategies, and learning from both my wins and my losses. Like most traders, I realized there wasn't a shortcut to consistency—it came from understanding how the market moves and following a proven process.
              </p>
              
              <p>
                Over the years, I've taught traders from all experience levels and developed several profitable manual trading systems. Every system taught me something new, and each one helped shape the trading approach I use today.
              </p>
              
              <p className="text-foreground font-medium">
                Eventually, I decided to combine everything I'd learned into one complete system: <strong className="text-[#00D4FF]">16London Trend Algo.</strong>
              </p>
              
              <p>
                This system wasn't built overnight. It's the result of years of chart time, testing, and refining. My goal wasn't to create another flashy indicator—it was to build something that gives traders clear direction, removes unnecessary guesswork, and helps them trade with confidence.
              </p>
              
              <p>
                As I begin focusing on other opportunities, I wanted to leave something valuable behind for my community. The 16London Trend Algo is my way of sharing the knowledge I've gained over the years and giving traders a system they can rely on.
              </p>
              
              <p>
                I truly believe that trading doesn't have to be complicated. With the right structure, discipline, and tools, anyone willing to learn can become a consistently better trader.
              </p>
              
              <p className="text-xl text-foreground italic border-l-4 border-[#00D4FF] pl-4 py-2 my-8 bg-[#00D4FF]/5 rounded-r-lg">
                "Welcome to 16London Trend Algo. I hope it becomes a part of your trading journey just as it has been a part of mine."
              </p>

              <hr className="border-[#00D4FF]/20 my-12" />

              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg">
                To simplify professional trading by providing a structured system that helps traders make smarter decisions, build confidence, and achieve long-term consistency.
              </p>

              <hr className="border-[#00D4FF]/20 my-12" />

              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Why I Built 16London Trend Algo</h2>
              <p>
                After teaching trading for more than eight years, I noticed most traders struggled with the same problems—overcomplicated indicators, conflicting signals, and emotional decision-making. I created the 16London Trend Algo to solve those problems.
              </p>
              <p>
                The system combines trend analysis, market structure, multi-timeframe confirmation, and clear buy and sell signals into one professional workflow. Instead of guessing, traders can follow a structured process built on objective market conditions.
              </p>
              
              <div className="bg-background border border-[#00D4FF]/20 rounded-2xl p-8 mt-8">
                <p className="font-bold text-foreground mb-6 text-xl">Whether you're a beginner or an experienced trader, the goal remains the same:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-[#00D4FF]/10">
                    <Check className="text-[#00D4FF] w-6 h-6 shrink-0" /> 
                    <span className="text-foreground font-medium">Trade with confidence</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-[#00D4FF]/10">
                    <Check className="text-[#00D4FF] w-6 h-6 shrink-0" /> 
                    <span className="text-foreground font-medium">Eliminate unnecessary noise</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-[#00D4FF]/10">
                    <Check className="text-[#00D4FF] w-6 h-6 shrink-0" /> 
                    <span className="text-foreground font-medium">Focus on high-probability setups</span>
                  </div>
                  <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-[#00D4FF]/10">
                    <Check className="text-[#00D4FF] w-6 h-6 shrink-0" /> 
                    <span className="text-foreground font-medium">Build long-term consistency</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <Link href="/#pricing" className="inline-block bg-[#00D4FF] hover:bg-[#00B3D6] text-[#0A1628] px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                Get Access Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
