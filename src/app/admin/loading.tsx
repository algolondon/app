export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-16">
      {/* Generic Clean Header Skeleton */}
      <div className="bg-[#12223A]/80 border border-white/10 p-6 md:p-8 rounded-3xl h-36 flex flex-col justify-center space-y-3">
        <div className="h-8 w-64 bg-white/10 rounded-2xl"></div>
        <div className="h-4 w-96 bg-white/5 rounded-xl"></div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#12223A]/70 border border-white/10 h-36 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-white/10"></div>
              <div className="w-16 h-5 rounded-full bg-white/5"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-white/10 rounded"></div>
              <div className="h-7 w-28 bg-white/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#12223A]/70 border border-white/10 rounded-3xl p-6 h-80 space-y-4">
          <div className="h-6 w-48 bg-white/10 rounded-xl"></div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>

        <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-6 h-80 space-y-4">
          <div className="h-6 w-36 bg-white/10 rounded-xl"></div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
