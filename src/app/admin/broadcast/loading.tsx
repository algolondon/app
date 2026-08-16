export default function BroadcastLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-24">
      {/* Header Skeleton */}
      <div className="bg-[#12223A]/80 border border-white/10 p-6 md:p-8 rounded-3xl h-36 flex flex-col justify-center space-y-3">
        <div className="h-8 w-64 bg-white/10 rounded-2xl"></div>
        <div className="h-4 w-96 bg-white/5 rounded-xl"></div>
      </div>

      {/* Split screen composer skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#12223A]/70 border border-white/10 rounded-3xl p-8 space-y-6 h-[560px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-[#0A1628] rounded-2xl"></div>
            <div className="h-12 bg-[#0A1628] rounded-2xl"></div>
          </div>
          <div className="h-12 bg-[#0A1628] rounded-2xl"></div>
          <div className="h-64 bg-[#0A1628] rounded-2xl"></div>
          <div className="h-12 bg-white/10 rounded-2xl"></div>
        </div>

        <div className="lg:col-span-5 bg-[#12223A]/50 border border-white/10 rounded-3xl p-6 h-[560px]">
          <div className="h-full bg-[#0A1628] rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
