import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight, 
  Video, 
  Mail, 
  Palette, 
  ShieldCheck, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Layers
} from "lucide-react";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Course } from "@/models/Course";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats = {
    totalUsers: 0,
    activeSubscribers: 0,
    pendingUsers: 0,
    tier1Count: 0,
    tier2Count: 0,
    tier3Count: 0,
    totalCourses: 0
  };

  let recentUsers: any[] = [];

  try {
    if (process.env.MOCK_ENV === 'true') {
      stats = { 
        totalUsers: 145, 
        activeSubscribers: 120, 
        pendingUsers: 12,
        tier1Count: 45, 
        tier2Count: 55, 
        tier3Count: 20,
        totalCourses: 8
      };
      recentUsers = [
        { _id: "1", name: "Alex Mercer", email: "alex@example.com", tier: "tier2", active: true, createdAt: new Date() },
        { _id: "2", name: "Marcus Vance", email: "marcus@trader.io", tier: "tier3", active: true, createdAt: new Date(Date.now() - 3600000) },
        { _id: "3", name: "Elena Rostova", email: "elena@crypto.net", tier: "tier1", active: false, status: "pending_payment", createdAt: new Date(Date.now() - 7200000) },
      ];
    } else {
      await connectToDatabase();
      const [
        totalUsers, 
        activeSubscribers, 
        pendingUsers,
        tier1Count, 
        tier2Count, 
        tier3Count,
        totalCourses,
        recentDocs
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ active: true }),
        User.countDocuments({ status: "pending_payment" }),
        User.countDocuments({ active: true, tier: "tier1" }),
        User.countDocuments({ active: true, tier: "tier2" }),
        User.countDocuments({ active: true, tier: "tier3" }),
        Course.countDocuments({ isActive: true }),
        User.find().sort({ createdAt: -1 }).limit(6).lean()
      ]);

      stats = { totalUsers, activeSubscribers, pendingUsers, tier1Count, tier2Count, tier3Count, totalCourses };
      recentUsers = recentDocs || [];
    }
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
  }

  const estimatedRevenue = (stats.tier1Count * 59.99) + (stats.tier2Count * 89.99) + (stats.tier3Count * 119.99);
  const activeRate = stats.totalUsers > 0 ? Math.round((stats.activeSubscribers / stats.totalUsers) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-[#12223A]/90 via-[#0E1A2D]/90 to-[#0A1628]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Real-Time Sync
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Welcome back, Admin. Real-time platform metrics, member subscriptions, and quick actions.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            href="/admin/customizer"
            className="flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00B3D6] text-[#050B14] font-bold px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-200 text-sm"
          >
            <Palette className="w-4 h-4" />
            Live Page Editor
          </Link>
        </div>
      </div>

      {/* ── 4 STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#00D4FF]/30 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -mr-16 -mt-16 rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
              Registered
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Members</p>
          <p className="text-3xl font-display font-extrabold text-white mt-1 relative z-10">
            {stats.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16 rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeRate}% Active
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Subscribers</p>
          <p className="text-3xl font-display font-extrabold text-emerald-400 mt-1 relative z-10">
            {stats.activeSubscribers.toLocaleString()}
          </p>
        </div>

        {/* Tier 2 & Tier 3 Split */}
        <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -mr-16 -mt-16 rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              High Tier
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">London X &amp; Complete</p>
          <p className="text-3xl font-display font-extrabold text-purple-400 mt-1 relative z-10">
            {(stats.tier2Count + stats.tier3Count).toLocaleString()}
          </p>
        </div>

        {/* Estimated MRR */}
        <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#00D4FF]/40 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/10 blur-[50px] -mr-16 -mt-16 rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF]">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
              Monthly
            </span>
          </div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Est. Monthly Revenue</p>
          <p className="text-3xl font-display font-extrabold text-white mt-1 relative z-10">
            ${estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>

      </div>

      {/* ── QUICK ACTION COMMAND HUB ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link 
          href="/admin/users" 
          className="bg-[#12223A]/50 hover:bg-[#12223A] border border-white/5 hover:border-[#00D4FF]/30 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors">Users Directory</p>
              <p className="text-xs text-gray-400">Manage &amp; activate members</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </Link>

        <Link 
          href="/admin/courses" 
          className="bg-[#12223A]/50 hover:bg-[#12223A] border border-white/5 hover:border-[#00D4FF]/30 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors">Course Library</p>
              <p className="text-xs text-gray-400">{stats.totalCourses} training modules</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </Link>

        <Link 
          href="/admin/broadcast" 
          className="bg-[#12223A]/50 hover:bg-[#12223A] border border-white/5 hover:border-[#00D4FF]/30 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors">Email Broadcast</p>
              <p className="text-xs text-gray-400">Marketing &amp; announcements</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </Link>

        <Link 
          href="/admin/settings" 
          className="bg-[#12223A]/50 hover:bg-[#12223A] border border-white/5 hover:border-[#00D4FF]/30 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors">Admin Settings</p>
              <p className="text-xs text-gray-400">Password, SMTP, PayPal</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </Link>

      </div>

      {/* ── TWO COLUMN: RECENT SIGNUPS + TIER DISTRIBUTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-2 bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Latest Member Signups</h2>
            </div>
            <Link href="/admin/users" className="text-xs font-semibold text-[#00D4FF] hover:underline flex items-center gap-1">
              View All Users →
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentUsers.length === 0 ? (
              <p className="text-gray-400 text-sm py-6 text-center">No recent signups found.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u._id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-[#00D4FF] shrink-0">
                      {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[#00D4FF] transition-colors">
                        {u.name || "Member"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      u.tier === 'tier3'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : u.tier === 'tier2'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {u.tier === 'tier3' ? 'Complete' : u.tier === 'tier2' ? 'London X' : 'Trend Algo'}
                    </span>

                    {u.status === 'pending_payment' ? (
                      <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    ) : u.active ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Membership Distribution */}
        <div className="bg-[#12223A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Tier Breakdown</h2>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-blue-400">Tier 1 · Trend Algo ($59.99)</span>
                  <span className="text-white font-bold">{stats.tier1Count} Users</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.activeSubscribers > 0 ? (stats.tier1Count / stats.activeSubscribers) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-purple-400">Tier 2 · London X ($89.99)</span>
                  <span className="text-white font-bold">{stats.tier2Count} Users</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.activeSubscribers > 0 ? (stats.tier2Count / stats.activeSubscribers) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-yellow-400">Tier 3 · Complete ($119.99)</span>
                  <span className="text-white font-bold">{stats.tier3Count} Users</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.activeSubscribers > 0 ? (stats.tier3Count / stats.activeSubscribers) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 space-y-1.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00D4FF]" /> 
              Instant PayPal Sync
            </p>
            <p>
              Subscription activations and webhook events update user tier statuses in milliseconds.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
