export default function CustomizerLoading() {
  return (
    <div className="flex h-[calc(100vh-6rem)] -mt-4 -mb-8 -mx-4 md:-mx-8 overflow-hidden bg-[#050B14] animate-pulse">
      {/* Left panel skeleton */}
      <div className="w-[420px] bg-[#0A1628] border-r border-white/10 p-4 space-y-4">
        <div className="h-10 bg-white/10 rounded-2xl"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-16 bg-[#12223A] rounded-2xl"></div>
          ))}
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="flex-1 bg-[#050B14] p-6 flex items-center justify-center">
        <div className="w-full h-full bg-[#0A1628] rounded-3xl border border-white/10"></div>
      </div>
    </div>
  );
}
