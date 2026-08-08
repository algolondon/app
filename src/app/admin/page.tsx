"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    tier1Count: 0,
    tier2Count: 0,
    tier3Count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const estimatedRevenue = (stats.tier1Count * 59.99) + (stats.tier2Count * 89.99) + (stats.tier3Count * 119.99);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#12223A] h-32 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toString()} 
            icon={Users} 
            color="text-blue-400"
            bg="bg-blue-400/10"
          />
          <StatCard 
            title="Active Subscribers" 
            value={stats.activeSubscribers.toString()} 
            icon={UserCheck} 
            color="text-green-400"
            bg="bg-green-400/10"
          />
          <StatCard 
            title="Tier 2 (London X)" 
            value={stats.tier2Count.toString()} 
            icon={TrendingUp} 
            color="text-purple-400"
            bg="bg-purple-400/10"
          />
          <StatCard 
            title="Est. Monthly Revenue" 
            value={`$${estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} 
            icon={DollarSign} 
            color="text-yellow-400"
            bg="bg-yellow-400/10"
          />
        </div>
      )}

      {/* PostHog Embedded Dashboard */}
      <div className="bg-[#12223A] border border-white/5 rounded-2xl p-6 h-[500px] md:h-[800px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Website Analytics & Activity</h2>
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/20">Live from PostHog</span>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden border border-white/10">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen 
            src="https://us.posthog.com/embedded/26srXvzlkOw1cHKvsP_d4AAADmPoeQ" 
            key="0" 
            sandbox="allow-scripts allow-same-origin allow-popups"
            className="w-full h-full bg-white"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-[#12223A] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00D4FF]/20 transition-colors">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bg} blur-[50px] -mr-16 -mt-16 rounded-full transition-opacity opacity-50 group-hover:opacity-100`}></div>
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="font-medium text-gray-400">{title}</h3>
      </div>
      
      <p className="text-3xl font-display font-bold relative z-10">{value}</p>
    </div>
  );
}
