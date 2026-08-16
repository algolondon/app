export default function MembersPortalLoading() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white animate-pulse">
      {/* Header bar placeholder */}
      <div className="h-20 bg-[#0A1628]/80 border-b border-white/5" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-8">
        {/* Welcome banner skeleton */}
        <div className="bg-[#12223A]/80 rounded-3xl p-8 border border-white/10 h-48 flex flex-col justify-center space-y-3">
          <div className="h-4 w-32 bg-white/10 rounded-full" />
          <div className="h-8 w-72 bg-white/20 rounded-xl" />
          <div className="h-4 w-96 bg-white/5 rounded-lg" />
        </div>

        {/* 3 Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#12223A]/70 rounded-3xl p-6 border border-white/10 h-32 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white/10" />
              <div className="space-y-1">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-6 w-32 bg-white/20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#12223A]/70 rounded-3xl p-8 border border-white/10 h-64" />
            <div className="bg-[#12223A]/70 rounded-3xl p-8 border border-white/10 h-56" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#12223A]/70 rounded-3xl p-6 border border-white/10 h-56" />
            <div className="bg-[#12223A]/70 rounded-3xl p-6 border border-white/10 h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
