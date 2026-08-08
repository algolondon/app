"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Check, 
  CreditCard, 
  User, 
  Zap, 
  Lock, 
  PlaySquare, 
  LineChart, 
  BookOpen, 
  MessageSquare, 
  Headset,
  ChevronDown,
  Menu,
  Settings
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SocialProof } from "@/components/social-proof";
import { AlgoInAction } from "@/components/algo-in-action";
import { Navbar } from "@/components/navbar";
import { MockupFrame } from "@/components/mockup-frame";

// Fade in up animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HomeClient({ sanityData }: { sanityData?: any }) {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultFaqs = [
    {
      q: "Is this a one-time payment?",
      a: "No, access is subscription-based monthly. Cancel anytime from your members portal."
    },
    {
      q: "Do I need TradingView Pro?",
      a: "A free TradingView account is sufficient, but Pro allows for more indicators on one chart."
    },
    {
      q: "How do I get access after payment?",
      a: "After checkout, you'll be asked for your TradingView username. Kazi will manually grant access within 24 hours."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, cancel anytime through your PayPal subscription settings. No questions asked."
    },
    {
      q: "Are these indicators repaint?",
      a: "No. The 16London indicators are non-repainting. What you see is what you get."
    }
  ];

  const faqs = sanityData?.faqs?.length 
    ? sanityData.faqs.map((f: any) => ({ q: f.question, a: f.answer })) 
    : defaultFaqs;

  return (
    <main className="flex flex-col min-h-screen selection:bg-primary selection:text-foreground relative">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* MARQUEE TICKER BAR */}
      <div className="bg-muted text-foreground border-b border-[#00D4FF]/20 text-[12px] uppercase tracking-wider font-semibold relative flex items-center z-50 h-10 overflow-hidden hidden sm:flex">
        <div className="bg-muted px-4 h-full flex items-center border-r border-[#00D4FF]/20 absolute left-0 z-10 shrink-0 shadow-xl">
          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] mr-2">LIVE</span>
          MANUAL TRADINGVIEW INVITES OPEN (24H ACCESS)
        </div>
        <div className="flex-1 overflow-hidden ml-[400px] mr-[100px]">
          <div className="whitespace-nowrap inline-flex animate-marquee">
            <span className="mx-8">🟢 EURUSD: STRONG BUY SIGNAL CONFIRMED</span>
            <span className="mx-8">🟢 XAUUSD: BUY SIGNAL @ 2420.50 (+240 PIPS)</span>
            <span className="mx-8">🟢 16LONDON TREND ALGO V1: INTRADAY EMA 87 BULLISH</span>
            <span className="mx-8">🟢 GBPUSD: LONDON X BREAKOUT CONFIRMED</span>
            {/* Duplicate for infinite loop */}
            <span className="mx-8">🟢 EURUSD: STRONG BUY SIGNAL CONFIRMED</span>
            <span className="mx-8">🟢 XAUUSD: BUY SIGNAL @ 2420.50 (+240 PIPS)</span>
            <span className="mx-8">🟢 16LONDON TREND ALGO V1: INTRADAY EMA 87 BULLISH</span>
            <span className="mx-8">🟢 GBPUSD: LONDON X BREAKOUT CONFIRMED</span>
          </div>
        </div>
        <div className="bg-muted px-4 h-full flex items-center absolute right-0 z-10 shrink-0 shadow-xl">
          ● MANUAL
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Column */}
            <motion.div 
              className="w-full lg:w-[55%] flex flex-col items-start text-left relative z-20"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-[#00D4FF] text-xs font-bold mb-6 border border-[#00D4FF] px-4 py-1.5 rounded-full flex items-center gap-2 bg-[#00D4FF]/5">
                ● {sanityData?.tagline || "8 YEAR PROVEN TRADING SYSTEMS"}
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                Built for Legacy.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#1B6FD8]">Designed for Wealth.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                Institutional grade trading algorithms built for serious traders. 8 years of live market experience distilled into proprietary TradingView tools plus complete masterclass.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
                {session ? (
                  <Link href="/members-portal" className="bg-[#00D4FF] hover:bg-[#00B3D6] text-background px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2">
                    Go to Dashboard <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link href="#pricing" className="bg-[#00D4FF] hover:bg-[#00B3D6] text-background px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                    Get Access Now (From $59.99/mo)
                  </Link>
                )}
                <Link href="#indicator-suite" className="border border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10 px-8 py-4 rounded-lg font-bold text-center transition-all duration-300">
                  Explore Systems ↓
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 text-sm text-foreground font-medium mb-16">
                <div className="flex items-center gap-2"><Check className="text-[#00D4FF] w-4 h-4"/> TradingView Invites</div>
                <div className="flex items-center gap-2"><Check className="text-[#00D4FF] w-4 h-4"/> Full Video Course</div>
                <div className="flex items-center gap-2"><Check className="text-[#00D4FF] w-4 h-4"/> Cancel Anytime</div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 w-full">
                <div className="bg-card rounded-xl p-4 flex-1 border border-[#00D4FF]/10">
                  <div className="text-xl font-bold text-foreground mb-1">{sanityData?.yearsTrading || "8+ Years"}</div>
                  <div className="text-xs text-muted-foreground">Trading &amp; Teaching</div>
                </div>
                <div className="bg-card rounded-xl p-4 flex-1 border border-[#00D4FF]/10">
                  <div className="text-xl font-bold text-[#00D4FF] mb-1">{sanityData?.revenue || "$3,486"}</div>
                  <div className="text-xs text-muted-foreground">Soft Launch Revenue</div>
                </div>
                <div className="bg-card rounded-xl p-4 flex-1 border border-[#00D4FF]/10">
                  <div className="text-xl font-bold text-foreground mb-1">{sanityData?.numberOfAlgos || "3 Algos"}</div>
                  <div className="text-xs text-muted-foreground">Proprietary Systems</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div 
              className="w-full lg:w-[45%] relative z-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" as any, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-[#00D4FF] blur-3xl opacity-20 rounded-full transform-gpu"></div>
              
              <div className="flex flex-col gap-6">
                <div className="relative rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.15)] overflow-hidden border border-[#00D4FF]/20 group">
                  <Image 
                    src="/images/cover.jpg" 
                    alt="16London Trend Algo" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                
                <div className="relative bg-background/50 backdrop-blur-sm border border-[#00D4FF]/40 rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.1)] overflow-hidden">
                  {/* Mac-style header */}
                  <div className="bg-muted/50 px-4 py-3 border-b border-[#00D4FF]/20 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[#00D4FF] text-xs font-mono tracking-widest uppercase truncate max-w-[200px] sm:max-w-none">16LONDON TREND ALGO V1 · Rules &amp; Settings</div>
                    <Settings className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 mb-6 font-mono text-xs sm:text-sm">
                      <div className="text-muted-foreground">1. MAKE SURE TO CONFIRM 3-5 TIMEFRAME IN AGREEMENT</div>
                      <div className="text-muted-foreground">2. WAIT FOR A CLEAR BUY OR SELL SIGNAL</div>
                      <div className="text-muted-foreground">3. WAIT FOR STRONG BUY OR STRONG SELL FOR ENTRY</div>
                      <div className="text-muted-foreground">4. USE THE ZONES FOR STOP LOSS AND PULLBACK ENTRIES</div>
                    </div>

                    <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg border border-[#00D4FF]/10 text-[10px] sm:text-xs font-mono">
                      <div className="flex flex-col"><span className="text-gray-500">SWING TRADING</span><span className="text-[#00D4FF]">112</span></div>
                      <div className="flex flex-col"><span className="text-gray-500">INTRA DAY</span><span className="text-[#00D4FF]">87</span></div>
                      <div className="flex flex-col"><span className="text-gray-500">SCALP</span><span className="text-[#00D4FF]">INTRADAY</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <SocialProof />
        </div>
      </section>

      {/* 2. THREE SYSTEMS */}
      <section id="indicator-suite" className="py-24 relative z-10 border-t border-[#00D4FF]/10 bg-background/50 backdrop-blur-sm transform-gpu">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Three Systems. One Institutional Edge.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Each indicator is precision-engineered for a specific market condition.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12">
            {/* Card 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-card border-l-4 border-[#00D4FF] border border-r-[#00D4FF]/20 border-y-[#00D4FF]/20 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:border-y-[#00D4FF]/60 hover:border-r-[#00D4FF]/60 transition-all duration-300">
              <div className="w-full lg:w-1/2">
                <div className="inline-block bg-[#00D4FF] text-background text-xs font-bold px-3 py-1 rounded-full mb-6">MOST POPULAR</div>
                <h3 className="text-3xl font-display font-bold mb-4">16London Trend ALGO™</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Our flagship indicator. Visually maps the market trend so you never trade against momentum. Multi-timeframe dashboard built in.</p>
              </div>
              <div className="w-full lg:w-1/2">
                <MockupFrame title="16LONDON TREND ALGO V1">
                  <Image src="/images/trend-algo-chart.png" alt="Trend ALGO" width={600} height={400} className="w-full" />
                </MockupFrame>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-card border-r-4 border-[#00D4FF] border border-l-[#00D4FF]/20 border-y-[#00D4FF]/20 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row-reverse items-center gap-12 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:border-y-[#00D4FF]/60 hover:border-l-[#00D4FF]/60 transition-all duration-300">
              <div className="w-full lg:w-1/2 lg:pl-12">
                <h3 className="text-3xl font-display font-bold mb-4">London X System</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Designed specifically for the London session breakout. Captures explosive moves with pinpoint accuracy. Perfect for early morning traders.</p>
              </div>
              <div className="w-full lg:w-1/2">
                <MockupFrame title="LONDON X BREAKOUT">
                  <Image src="/images/new_assets/London X image 1.png" alt="London X" width={600} height={400} className="w-full" />
                </MockupFrame>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-card border-l-4 border-[#00D4FF] border border-r-[#00D4FF]/20 border-y-[#00D4FF]/20 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:border-y-[#00D4FF]/60 hover:border-r-[#00D4FF]/60 transition-all duration-300">
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-display font-bold mb-4">16London ATM System™</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">ATM stands for Accumulation, Trap, Manipulation. Identifies institutional footprints before the big move. Advanced entries only.</p>
              </div>
              <div className="w-full lg:w-1/2">
                <MockupFrame title="16LONDON ATM SYSTEM">
                  <Image src="/images/new_assets/ATM System Image 1.png" alt="ATM System" width={600} height={400} className="w-full" />
                </MockupFrame>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.5 ALGO IN ACTION */}
      <AlgoInAction />

      {/* 3. HOW ACCESS WORKS */}
      <section id="how-it-works" className="py-24 relative z-10 border-t border-[#00D4FF]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">How Access Works</h2>
            <p className="text-xl text-muted-foreground">Getting started takes less than 5 minutes.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-[repeating-linear-gradient(90deg,#00D4FF,#00D4FF_10px,transparent_10px,transparent_20px)] opacity-30"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center relative z-10">
              {[
                { icon: CreditCard, step: 1, title: "Choose Your Tier", desc: "Select the subscription that fits your trading goals." },
                { icon: User, step: 2, title: "Submit Your TV Username", desc: "After payment, enter your TradingView username so we can grant access." },
                { icon: Zap, step: 3, title: "Start Trading", desc: "Receive your invite link and get instant access to the indicators." }
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: i * 0.2 }}>
                  <div className="w-24 h-24 mx-auto bg-card border border-[#00D4FF]/30 rounded-full flex items-center justify-center relative mb-8 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                    <item.icon className="w-10 h-10 text-[#00D4FF]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00D4FF] text-background rounded-full font-bold flex items-center justify-center text-sm border-2 border-[#0A1628]">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT MEMBERS GET */}
      <section id="what-members-get" className="py-24 relative z-10 border-t border-[#00D4FF]/10 bg-background/50 backdrop-blur-sm transform-gpu">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">What Members Get</h2>
            <p className="text-xl text-muted-foreground">Everything you need. Nothing you don't.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "Invite-Only Indicators", desc: "TradingView access" },
              { icon: PlaySquare, title: "Video Course Library", desc: "Step-by-step modules" },
              { icon: LineChart, title: "Live Trade Examples", desc: "Real chart breakdowns" },
              { icon: BookOpen, title: "Full System Rules", desc: "No guessing, ever" },
              { icon: MessageSquare, title: "Telegram VIP Access", desc: "Community + signals" },
              { icon: Headset, title: "One-on-One Support", desc: "Direct access to Kazi" }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: i * 0.1 }} className="bg-card border border-[#00D4FF]/20 rounded-xl p-8 hover:-translate-y-2 hover:border-[#00D4FF]/60 hover:shadow-[0_10px_30px_rgba(0,212,255,0.15)] transition-all duration-300">
                <item.icon className="w-8 h-8 text-[#00D4FF] mb-6" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE 4 RULES */}
      <section id="golden-rules" className="py-24 relative z-10 border-t border-[#00D4FF]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full lg:w-[55%]">
              <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-display font-bold mb-4">The 4 Trading Rules.</motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-[#00D4FF] mb-12 font-medium">Never Break Them.</motion.p>
              
              <div className="space-y-6 mb-16">
                {[
                  "Only trade in the direction of the Trend Algo",
                  "Wait for multi-timeframe confirmation",
                  "Never risk more than 1% per trade",
                  "No trades during high-impact news events"
                ].map((rule, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-start gap-4">
                    <span className="text-3xl font-display font-bold text-[#00D4FF] mt-1">{i + 1}.</span>
                    <span className="text-xl text-muted-foreground">{rule}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="border-t border-gray-200 dark:border-foreground/10 pt-10">
                <h3 className="text-3xl font-bold mb-2">Meet Kazi</h3>
                <h4 className="text-lg text-[#00D4FF] font-medium mb-6">Founder of 16London Trend Algo</h4>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  I&apos;m Kaziyel, born and raised in Miami, Florida. After 8+ years in the trenches of the financial markets, I realized that consistency doesn&apos;t come from flashy indicators—it comes from structure, discipline, and a proven process. 
                  <br/><br/>
                  I built the 16London Trend Algo to remove the guesswork and help you trade with absolute confidence.
                </p>

                <Link href="/about" className="inline-flex items-center gap-2 bg-card border border-[#00D4FF]/30 hover:border-[#00D4FF] text-foreground px-6 py-3 rounded-lg font-bold transition-all hover:bg-[#00D4FF]/5">
                  Read My Full Story <span className="text-[#00D4FF]">→</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-[45%] relative">
              <div className="absolute inset-0 bg-[#00D4FF] blur-2xl opacity-20 rounded-full transform-gpu"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden border border-[#00D4FF]/20 shadow-[0_0_50px_rgba(0,212,255,0.15)] group">
                <Image src="/images/hero-graphic.png" alt="16London Trend Algo Graphic" width={800} height={800} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="py-24 relative z-10 border-t border-[#00D4FF]/10 bg-background/50 backdrop-blur-sm transform-gpu">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,212,255,0.1),transparent_70%)] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Choose Your Edge.</h2>
            <p className="text-xl text-muted-foreground">Cancel anytime. No contracts. No fluff.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Tier 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }} className="bg-card border border-[#00D4FF]/20 rounded-3xl p-8 hover:border-[#00D4FF]/50 transition-colors flex flex-col h-[600px]">
              <h3 className="text-2xl font-display font-bold text-muted-foreground mb-2">16London Trend Algo</h3>
              <div className="mb-8">
                <span className="text-4xl font-display font-bold text-foreground">$59.99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">16London Trend Algo V1</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Members Portal Access</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Full Video Course</span></li>
              </ul>
              <div className="mt-auto w-full pt-4">
                <Link href="/checkout?tier=1" className="flex items-center justify-center w-full bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-bold py-3.5 rounded-xl transition-colors shadow-lg">
                  <span className="italic mr-1 text-[#003087] font-bold">PayPal</span> Subscribe
                </Link>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-500 font-medium">
                  <Lock className="w-3 h-3 text-green-500" /> Secure 256-bit Encrypted Checkout
                </div>
              </div>
            </motion.div>

            {/* Tier 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }} className="bg-card border border-[#00D4FF]/20 rounded-3xl p-8 hover:border-[#00D4FF]/50 transition-colors flex flex-col h-[600px]">
              <h3 className="text-2xl font-display font-bold text-muted-foreground mb-2">Trend Algo + London X</h3>
              <div className="mb-8">
                <span className="text-4xl font-display font-bold text-foreground">$89.99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">16London Trend Algo V1</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-foreground font-bold">London X System</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Members Portal Access</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Full Video Course</span></li>
              </ul>
              <div className="mt-auto w-full pt-4">
                <Link href="/checkout?tier=2" className="flex items-center justify-center w-full bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-bold py-3.5 rounded-xl transition-colors shadow-lg">
                  <span className="italic mr-1 text-[#003087] font-bold">PayPal</span> Subscribe
                </Link>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-500 font-medium">
                  <Lock className="w-3 h-3 text-green-500" /> Secure 256-bit Encrypted Checkout
                </div>
              </div>
            </motion.div>

            {/* Tier 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.3 }} className="bg-card border-2 border-[#00D4FF] rounded-3xl p-8 shadow-[0_0_30px_rgba(0,212,255,0.2)] transform md:-translate-y-4 flex flex-col h-[640px] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D4FF] text-background px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap">BEST VALUE</div>
              <h3 className="text-2xl font-display font-bold text-[#00D4FF] mb-2">16London Complete System</h3>
              <div className="mb-8">
                <span className="text-5xl font-display font-bold text-foreground">$119.99</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">16London Trend Algo V1</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-foreground font-bold">London X System</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-foreground font-bold">16London ATM System</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Members Portal Access</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Complete Video Masterclass</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#00D4FF] w-5 h-5 shrink-0 mt-0.5" /><span className="text-muted-foreground">Future System Updates</span></li>
              </ul>
              <div className="mt-auto w-full pt-4">
                <Link href="/checkout?tier=3" className="flex items-center justify-center w-full bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-bold py-3.5 rounded-xl transition-colors shadow-lg">
                  <span className="italic mr-1 text-[#003087] font-bold">PayPal</span> GET COMPLETE ACCESS
                </Link>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-500 font-medium">
                  <Lock className="w-3 h-3 text-green-500" /> Secure 256-bit Encrypted Checkout
                </div>
              </div>
            </motion.div>

          </div>
          
          {!session && (
            <div className="mt-12 text-center relative z-10">
              <p className="text-muted-foreground">
                Already a member?{" "}
                <Link href="/login" className="text-[#00D4FF] hover:text-[#00B3D6] font-bold transition-colors">
                  Login here →
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 relative z-10 border-t border-[#00D4FF]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq: { q: string, a: string }, i: number) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: i * 0.1 }} className="bg-card border border-[#00D4FF]/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-foreground/5 transition-colors"
                >
                  <span className="text-lg font-bold">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center text-[#00D4FF]">
                      <span className="absolute w-full h-0.5 bg-current"></span>
                      <span className="absolute h-full w-0.5 bg-current"></span>
                    </div>
                  </motion.div>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-24 relative z-10 border-t border-[#00D4FF]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-card border border-[#00D4FF]/50 rounded-[3rem] p-12 lg:p-20 text-center shadow-[0_0_50px_rgba(0,212,255,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/10 to-transparent"></div>
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 relative z-10">Join 16London X Brands LLC Today.</h2>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">Stop guessing. Start trading with an institutional edge.</p>
            <Link href="#pricing" className="inline-block bg-[#00D4FF] hover:bg-[#00B3D6] text-background px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(0,212,255,0.5)] relative z-10">
              Choose Your Plan
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
