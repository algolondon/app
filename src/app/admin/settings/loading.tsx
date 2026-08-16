export default function SettingsLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-24">
      {/* Header Skeleton */}
      <div className="bg-[#12223A]/80 border border-white/10 p-6 md:p-8 rounded-3xl h-36 flex flex-col justify-center space-y-3">
        <div className="h-8 w-64 bg-white/10 rounded-2xl"></div>
        <div className="h-4 w-96 bg-white/5 rounded-xl"></div>
      </div>

      {/* Two Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-8 h-80"></div>
          <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-8 h-64"></div>
        </div>
        <div className="space-y-8">
          <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-8 h-80"></div>
          <div className="bg-[#12223A]/70 border border-white/10 rounded-3xl p-8 h-64"></div>
        </div>
      </div>
    </div>
  );
}
