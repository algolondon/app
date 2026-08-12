export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#12223A] h-32 rounded-2xl border border-white/5"></div>
        ))}
      </div>

      {/* PostHog External Link */}
      <div className="bg-[#12223A] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl font-bold">Website Analytics & Activity</h2>
          <p className="text-gray-400 max-w-lg">
            To ensure the admin dashboard remains lightning fast, analytics have been moved. You can view all live traffic, user behavior, and site analytics directly on the PostHog website.
          </p>
          <div className="bg-[#00D4FF]/20 text-[#0A1628] font-bold py-3 px-6 rounded-lg mt-4 w-48 h-12 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
