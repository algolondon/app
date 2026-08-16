export default function AdminCoursesLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-16">
      {/* Header Skeleton */}
      <div className="bg-[#12223A]/80 border border-white/10 p-6 md:p-8 rounded-3xl h-40 flex flex-col justify-center space-y-4">
        <div className="h-8 w-64 bg-white/10 rounded-xl"></div>
        <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#12223A]/60 border border-white/5 p-5 rounded-2xl h-24 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10"></div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-white/10 rounded"></div>
                <div className="h-6 w-12 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar Skeleton */}
      <div className="h-14 bg-[#12223A]/40 border border-white/5 rounded-2xl"></div>

      {/* Course Rows Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#12223A]/70 border border-white/5 rounded-2xl p-4 md:p-5 h-24 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/10"></div>
              <div className="w-28 h-16 rounded-xl bg-white/10"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-white/15 rounded"></div>
                <div className="h-3 w-32 bg-white/5 rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-6 rounded-full bg-white/10"></div>
              <div className="w-24 h-8 rounded-xl bg-white/10"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
