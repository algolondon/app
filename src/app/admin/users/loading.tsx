export default function AdminUsersLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-28">
      {/* Header Skeleton */}
      <div className="bg-[#12223A]/80 border border-white/10 p-6 md:p-8 rounded-3xl h-36 flex flex-col justify-center space-y-4">
        <div className="h-8 w-64 bg-white/10 rounded-xl"></div>
        <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
      </div>

      {/* Metric Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#12223A]/50 border border-white/5 p-5 rounded-2xl h-24 flex flex-col justify-between">
            <div className="h-3 w-20 bg-white/10 rounded"></div>
            <div className="h-6 w-16 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-16 bg-[#12223A]/40 border border-white/5 rounded-3xl"></div>

      {/* Table Skeleton */}
      <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-6 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 bg-white/5 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
