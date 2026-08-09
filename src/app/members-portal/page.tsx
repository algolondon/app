import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { PlaySquare, FileText, Send, ExternalLink, CheckCircle, BookOpen } from "lucide-react";
import Image from "next/image";
import { TVUsernameForm } from "@/components/TVUsernameForm";
import { MotionDiv, fadeInUp, staggerContainer } from "@/components/motion-wrapper";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { client } from "@/sanity/client";

export default async function MembersPortal() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { user: sessionUser } = session;

  let user: any = null;
  if (process.env.MOCK_ENV === 'true') {
    user = {
      _id: "mock-123",
      email: sessionUser.email,
      name: sessionUser.name,
      tier: sessionUser.tier || "tier3",
      tradingviewUsername: "",
      completedModules: [],
      active: true,
      role: (sessionUser as any).role || "user"
    };
  } else {
    try {
      await connectDB();
      user = await User.findOne({ email: sessionUser.email }).lean();
    } catch (e) {
      console.error(e);
    }
  }

  if (!user && process.env.MOCK_ENV !== 'true') {
    redirect("/login");
  } else if (!user) {
    user = { _id: "mock-fallback", completedModules: [], tier: "tier1", active: true };
  }

  if (!user.active && user.role !== 'admin') {
    const defaultTier = user.tier ? user.tier.replace('tier', '') : '1';
    redirect(`/checkout?tier=${defaultTier}`);
  }

  let totalCourses = 0;
  let settingsObj: Record<string, string> = {};
  
  try {
    await connectDB();
    const Course = (await import("@/models/Course")).Course;
    totalCourses = await Course.countDocuments({ isActive: true });
    
    const Setting = (await import("@/models/Setting")).Setting;
    const settings = await Setting.find().lean() as any[];
    settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to fetch data", error);
  }

  // Fallback if no courses
  if (totalCourses === 0) {
    totalCourses = 5; 
  }

  const completedCount = user.completedModules?.length || 0;
  const progressPercentage = Math.round((completedCount / totalCourses) * 100);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 bg-[#00D4FF] blur-[150px] opacity-10 rounded-full w-[500px] h-[500px] pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 relative z-10 pt-32 pb-24">
        <MotionDiv 
          className="max-w-5xl mx-auto px-6 lg:px-8 space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer as any}
        >
          
          {/* Gradient Hero Bar */}
          <MotionDiv variants={fadeInUp as any} className="relative overflow-hidden glass-panel rounded-2xl p-10">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-foreground">
                Welcome back, {user.name?.split(" ")[0] ?? "Member"}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Manage your 16London X Brands LLC subscription, access your proprietary tools, and dive into the course library.
              </p>
            </div>
            {/* Abstract shapes in the background of hero */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute right-[-10%] top-[-50%] w-[300px] h-[300px] rounded-full bg-[#00D4FF] blur-[80px]"></div>
              <div className="absolute right-[20%] bottom-[-50%] w-[200px] h-[200px] rounded-full bg-blue-500 blur-[60px]"></div>
            </div>
          </MotionDiv>

          {/* Stats Row */}
          <MotionDiv variants={fadeInUp as any} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Tier</p>
                <p className="text-xl font-bold text-[#00D4FF]">{user.tier.replace("tier", "Tier ")}</p>
              </div>
            </div>
            <div className="bg-card border border-foreground/10 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xl font-bold">{user.active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-foreground/10 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-xl font-bold">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                    : "2024"}
                </p>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv variants={fadeInUp as any} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* SECTION A — TradingView Access Status */}
              <section className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D4FF]"></div>
                  Your TradingView Access
                </h2>
                
                {user.tradingviewUsername ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500/20 p-2 rounded-full text-green-500 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Username Submitted: @{user.tradingviewUsername}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">Your access is active. You can now use the 16London indicators directly in your TradingView Invite-Only Scripts section. If you change your username, please contact support.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background border border-foreground/10 rounded-xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2">Connect Your TradingView</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">To get access to the proprietary indicators, please submit your TradingView username. Kazi will manually grant access within 24 hours.</p>
                      <TVUsernameForm />
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION B — Quick Links */}
              <section>
                <h2 className="text-xl font-bold mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/course-library" className="group glass-panel rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-4 relative overflow-hidden">
                    <div className="bg-[#00D4FF]/10 p-4 rounded-xl text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-background transition-colors relative z-10">
                      <PlaySquare className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg">Course Library</h3>
                      <p className="text-sm text-muted-foreground mt-1">Master the system strategies</p>
                    </div>
                    <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:bg-[#00D4FF]/20 transition-colors"></div>
                  </Link>

                  {settingsObj.pdfLink ? (
                    <a href={settingsObj.pdfLink} target="_blank" rel="noopener noreferrer" className="group glass-panel rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-4 relative overflow-hidden">
                      <div className="bg-[#00D4FF]/10 p-4 rounded-xl text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-background transition-colors relative z-10">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-bold text-lg">System Rules PDF</h3>
                        <p className="text-sm text-muted-foreground mt-1">Download your checklist</p>
                      </div>
                      <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:bg-[#00D4FF]/20 transition-colors"></div>
                    </a>
                  ) : (
                    <div className="glass-panel rounded-xl p-6 flex flex-col items-start gap-4 relative overflow-hidden opacity-50 cursor-not-allowed" title="PDF coming soon">
                      <div className="bg-foreground/5 p-4 rounded-xl text-muted-foreground relative z-10">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-bold text-lg">System Rules PDF</h3>
                        <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
                      </div>
                    </div>
                  )}

                  <a href={settingsObj.telegramLink || "https://t.me/+_JqY7DXwWpAxOGUx"} target="_blank" rel="noopener noreferrer" className="group glass-panel rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-4 relative overflow-hidden sm:col-span-2 md:col-span-1">
                    <div className="bg-[#00D4FF]/10 p-4 rounded-xl text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-background transition-colors relative z-10">
                      <Send className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg">Telegram Community</h3>
                      <p className="text-sm text-muted-foreground mt-1">Join the VIP room</p>
                    </div>
                    <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:bg-[#00D4FF]/20 transition-colors"></div>
                  </a>
                  
                  <a href="https://t.me/+SG2RBuGDmPI5OTkx" target="_blank" rel="noopener noreferrer" className="group glass-panel rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-4 relative overflow-hidden sm:col-span-2 md:col-span-1">
                    <div className="bg-[#00D4FF]/10 p-4 rounded-xl text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-background transition-colors relative z-10">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg">EBook Beginners Course</h3>
                      <p className="text-sm text-muted-foreground mt-1">Access the EBook</p>
                    </div>
                    <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:bg-[#00D4FF]/20 transition-colors"></div>
                  </a>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Course Progress</h3>
                  <div className="glass-panel p-6 rounded-xl border border-foreground/5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-lg font-bold">{progressPercentage}% Completed</span>
                      <span className="text-sm text-muted-foreground">{completedCount} of {totalCourses} Modules</span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-3 mb-4 overflow-hidden">
                      <div className="bg-[#00D4FF] h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    {progressPercentage === 100 ? (
                      <p className="text-sm text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> You have completed all modules!
                      </p>
                    ) : (
                      <Link href="/course-library" className="text-sm text-[#00D4FF] hover:underline">
                        Continue learning &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">
              
              {/* SECTION C — My Subscription */}
              <section className="glass-panel rounded-2xl p-6">
                <h2 className="font-bold mb-6 uppercase tracking-wider text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/40"></div>
                  My Subscription
                </h2>
                
                <div className="mb-8">
                  <div className="text-2xl font-display font-bold text-[#00D4FF] mb-2 leading-tight">
                    {user.tier === "tier1" && "16London Trend Algo"}
                    {user.tier === "tier2" && "Trend Algo + London X"}
                    {user.tier === "tier3" && "16London Complete System"}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-mono bg-foreground/5 px-2 py-0.5 rounded">
                      {user.tier === "tier1" && "$59.99 / mo"}
                      {user.tier === "tier2" && "$89.99 / mo"}
                      {user.tier === "tier3" && "$119.99 / mo"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <ManageSubscriptionButton stripeCustomerId={user.stripeCustomerId} paypalSubscriptionId={user.paypalSubscriptionId} />
                </div>
              </section>

              {/* SECTION D — Support */}
              <section className="glass-panel rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4 text-foreground/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h2 className="font-bold mb-2">Need Help?</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Have an issue with your indicators, billing, or access?</p>
                <a href="mailto:support@16londonalgo.com" className="inline-block bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 px-6 py-2 rounded-full text-sm font-bold transition-colors">
                  support@16londonalgo.com
                </a>
              </section>
              
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </main>
  );
}
