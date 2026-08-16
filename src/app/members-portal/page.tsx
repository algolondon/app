import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { 
  PlaySquare, 
  Send, 
  CheckCircle, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  CreditCard, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock
} from "lucide-react";
import Image from "next/image";
import { TVUsernameForm } from "@/components/TVUsernameForm";
import { MotionDiv, fadeInUp, staggerContainer } from "@/components/motion-wrapper";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { Setting } from "@/models/Setting";
import { SupportEmailButton } from "@/components/support-email-button";

export const dynamic = 'force-dynamic';

export default async function MembersPortal() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { user: sessionUser } = session;

  let user: any = null;
  let totalCourses = 0;
  let settingsObj: Record<string, string> = {};
  let shouldRedirect = false;
  let redirectUrl = "";

  if (process.env.MOCK_ENV === 'true') {
    user = {
      _id: "mock-123",
      email: sessionUser.email,
      name: sessionUser.name,
      tier: (sessionUser as any).tier || "tier3",
      tradingviewUsername: "",
      completedModules: [],
      active: true,
      role: (sessionUser as any).role || "user"
    };
    try {
      const [coursesCount, settings] = await Promise.all([
        Course.countDocuments({ isActive: true }),
        Setting.find().lean() as Promise<any[]>
      ]);
      totalCourses = coursesCount;
      settingsObj = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      await connectDB();
      const [fetchedUser, coursesCount, settings] = await Promise.all([
        User.findOne({ email: sessionUser.email }).lean(),
        Course.countDocuments({ isActive: true }),
        Setting.find().lean() as Promise<any[]>
      ]);
      
      user = fetchedUser;
      totalCourses = coursesCount;
      settingsObj = (settings || []).reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (e) {
      console.error("Failed to load user portal data:", e);
    }
  }

  if (!user && process.env.MOCK_ENV !== 'true') {
    shouldRedirect = true;
    redirectUrl = "/login";
  } else if (!user) {
    user = { _id: "mock-fallback", completedModules: [], tier: "tier1", active: true };
  }

  // Enforce cancellation expiry dynamically
  if (user && user.status === 'cancelled' && user.subscriptionEndDate) {
    if (new Date() > new Date(user.subscriptionEndDate)) {
      user.active = false;
      user.status = 'expired';
      if (process.env.MOCK_ENV !== 'true') {
        try {
          await connectDB();
          await User.updateOne({ _id: user._id }, { active: false, status: 'expired' });
        } catch(e) { console.error(e); }
      }
    }
  }

  if (user && !user.active && user.role !== 'admin') {
    const defaultTier = user.tier ? user.tier.replace('tier', '') : '1';
    shouldRedirect = true;
    redirectUrl = `/checkout?tier=${defaultTier}`;
  }

  if (shouldRedirect) {
    redirect(redirectUrl);
  }

  if (totalCourses === 0) {
    totalCourses = 8; 
  }

  const completedCount = user.completedModules?.length || 0;
  const progressPercentage = Math.round((completedCount / totalCourses) * 100);

  const tierLabel = 
    user.tier === "tier3" ? "Tier 3 · Complete System" :
    user.tier === "tier2" ? "Tier 2 · Trend Algo + London X" :
    "Tier 1 · 16London Trend Algo";

  const tierPrice = 
    user.tier === "tier3" ? "$119.99 / month" :
    user.tier === "tier2" ? "$89.99 / month" :
    "$59.99 / month";

  return (
    <main className="min-h-screen flex flex-col bg-[#050B14] text-white selection:bg-[#00D4FF] selection:text-black relative">
      {/* Background Lighting & Grid */}
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 bg-[#00D4FF]/10 blur-[150px] rounded-full w-[600px] h-[600px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 bg-blue-600/10 blur-[150px] rounded-full w-[500px] h-[500px] pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 relative z-10 pt-28 md:pt-32 pb-24">
        <MotionDiv 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer as any}
        >
          
          {/* ── 1. HERO GREETING BANNER ── */}
          <MotionDiv 
            variants={fadeInUp as any} 
            className="relative overflow-hidden bg-gradient-to-r from-[#12223A]/90 via-[#0E1A2D]/90 to-[#0A1628]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/25 shadow-[0_0_15px_rgba(0,212,255,0.15)]">
                    <Sparkles className="w-3.5 h-3.5" /> VIP Member Hub
                  </span>
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 hover:bg-yellow-500/20 transition-colors"
                    >
                      Admin Dashboard →
                    </Link>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                  Welcome back, {user.name ? user.name.split(" ")[0] : "Trader"}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Your institutional trading suite is active. Access your indicators, video strategies, and community room below.
                </p>
              </div>

              {/* Quick Jump CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link
                  href="/course-library"
                  className="flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-[#00B3D6] text-[#050B14] font-bold px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(0,212,255,0.35)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
                >
                  <PlaySquare className="w-4 h-4 stroke-[2.5]" />
                  Open Course Library
                </Link>
              </div>
            </div>

            {/* Grace Cancellation Banner if cancelled */}
            {user.status === 'cancelled' && user.subscriptionEndDate && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 relative z-10 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs sm:text-sm text-amber-300">
                  <strong>Subscription Cancellation Pending:</strong> Your access remains fully active until{" "}
                  <span className="font-bold underline">
                    {new Date(user.subscriptionEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>.
                </p>
              </div>
            )}
          </MotionDiv>

          {/* ── 2. METRIC STATS ROW ── */}
          <MotionDiv variants={fadeInUp as any} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Tier Card */}
            <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#00D4FF]/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-[#00D4FF]/10 text-[#00D4FF]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5 font-mono">
                  {tierPrice}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Plan</p>
              <p className="text-xl font-display font-extrabold text-white mt-0.5 truncate">{tierLabel}</p>
            </div>

            {/* Account Status Card */}
            <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PayPal Verified
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Membership Status</p>
              <p className="text-xl font-display font-extrabold text-emerald-400 mt-0.5">
                {user.status === 'cancelled' ? 'Active (Grace Period)' : user.active ? 'Active & In Good Standing' : 'Inactive'}
              </p>
            </div>

            {/* Member Since Card */}
            <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Verified
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</p>
              <p className="text-xl font-display font-extrabold text-white mt-0.5">
                {user.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                  : "2026"}
              </p>
            </div>

          </MotionDiv>

          {/* ── 3. MAIN WORKSPACE GRID ── */}
          <MotionDiv variants={fadeInUp as any} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: TRADINGVIEW & LEARNING PROGRESS (8 cols) ── */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* TradingView Access Center */}
              <section className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">TradingView Indicator Access</h2>
                      <p className="text-xs text-gray-400">Your TradingView account connected for indicator invitations.</p>
                    </div>
                  </div>
                </div>

                {user.tradingviewUsername ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">TradingView Username</p>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                            @{user.tradingviewUsername}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed pt-1">
                          Your account has been granted invitation access to the 16London Indicator Suite. Check your <strong>Invite-Only Scripts</strong> tab on TradingView!
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0A1628]/80 border border-white/5 text-xs text-gray-400 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#00D4FF]" /> How to load on your chart:
                      </p>
                      <p>Open TradingView → Click Indicators (Top Toolbar) → Select <strong>"Invite-Only Scripts"</strong> on the left menu → Click <strong>16London Trend Algo</strong> to add.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#0A1628] border border-[#00D4FF]/30 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white text-base">Submit Your TradingView Username</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        To receive invite access to the algorithms, please submit your exact TradingView username below. Kazi will manually activate your account within 24 hours.
                      </p>
                    </div>
                    <TVUsernameForm />
                  </div>
                )}
              </section>

              {/* Course Progress Section */}
              <section className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <PlaySquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Course Curriculum Progress</h2>
                      <p className="text-xs text-gray-400">Step-by-step masterclass videos to master all trading systems.</p>
                    </div>
                  </div>

                  <Link 
                    href="/course-library" 
                    className="text-xs font-bold text-[#00D4FF] hover:underline flex items-center gap-1"
                  >
                    Go to Videos <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-white">{progressPercentage}% Completed</span>
                    <span className="text-xs text-gray-400 font-mono">{completedCount} of {totalCourses} Modules Watched</span>
                  </div>
                  
                  <div className="w-full bg-[#0A1628] rounded-full h-3 overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-[#00D4FF] to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/course-library"
                    className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <PlaySquare className="w-4 h-4 text-[#00D4FF]" />
                    {completedCount === 0 ? "Start Module 1: Strategy Introduction" : "Continue Watching Course Library"}
                  </Link>
                </div>
              </section>

              {/* Exclusive Member Resources Grid */}
              <section className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                  VIP Resources &amp; Downloads
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Telegram VIP Link */}
                  <a
                    href={settingsObj.telegramLink || "https://t.me/+_JqY7DXwWpAxOGUx"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#12223A]/70 hover:bg-[#12223A] border border-white/10 hover:border-[#00D4FF]/40 rounded-3xl p-6 transition-all duration-200 group shadow-lg flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Send className="w-6 h-6" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-[#00D4FF] transition-colors">Telegram VIP Group</h4>
                      <p className="text-xs text-gray-400 mt-1">Live market breakdowns, trader community, and instant alerts.</p>
                    </div>
                  </a>

                  {/* Beginners E-Book */}
                  <a
                    href="https://t.me/+SG2RBuGDmPI5OTkx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#12223A]/70 hover:bg-[#12223A] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 transition-all duration-200 group shadow-lg flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">Trading Manual E-Book</h4>
                      <p className="text-xs text-gray-400 mt-1">16London complete manual for beginner and intermediate traders.</p>
                    </div>
                  </a>

                  {/* System Rules PDF */}
                  {settingsObj.pdfLink && (
                    <a
                      href={settingsObj.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#12223A]/70 hover:bg-[#12223A] border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-200 group shadow-lg flex flex-col justify-between h-44 sm:col-span-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Official System Rules PDF</h4>
                        <p className="text-xs text-gray-400 mt-1">Download the 4 Golden Rules and risk management execution cheat sheet.</p>
                      </div>
                    </a>
                  )}

                </div>
              </section>

            </div>

            {/* ── RIGHT COLUMN: SUBSCRIPTION & SUPPORT DESK (4 cols) ── */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Subscription Management Box */}
              <section className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white">Billing &amp; Subscription</h2>
                </div>

                <div className="bg-[#0A1628] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="font-bold text-white">{tierLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Billing:</span>
                    <span className="font-bold text-[#00D4FF]">{tierPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processor:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PayPal Auto-Pay
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <ManageSubscriptionButton paypalSubscriptionId={user.paypalSubscriptionId} />
                </div>
              </section>

              {/* 1-on-1 Direct Support Card */}
              <section className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Direct Founder Support</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Have questions regarding your indicator access, strategy rules, or account?
                  </p>
                </div>

                <div className="pt-2">
                  <SupportEmailButton email="support@16londonalgo.com" />
                </div>
              </section>

              {/* Security Badge */}
              <div className="p-4 rounded-2xl bg-[#0A1628]/60 border border-white/5 flex items-center gap-3 text-xs text-gray-400">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-bit Encrypted Member Session &amp; Protected TradingView Licensing</span>
              </div>

            </div>

          </MotionDiv>

        </MotionDiv>
      </div>
    </main>
  );
}
