export default function MembersPortalLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Shimmer header bar */}
      <div className="h-[72px] bg-card border-b border-foreground/10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome banner skeleton */}
        <div className="bg-card rounded-3xl p-8 mb-8 border border-foreground/10 animate-pulse">
          <div className="h-5 w-40 bg-foreground/10 rounded mb-3" />
          <div className="h-8 w-72 bg-foreground/10 rounded mb-2" />
          <div className="h-4 w-48 bg-foreground/10 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* TV username section */}
            <div className="bg-card rounded-2xl p-6 border border-foreground/10 animate-pulse space-y-4">
              <div className="h-4 w-32 bg-foreground/10 rounded" />
              <div className="h-10 bg-foreground/10 rounded-lg" />
            </div>

            {/* Quick access grid */}
            <div>
              <div className="h-6 w-28 bg-foreground/10 rounded mb-6 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-6 border border-foreground/10 animate-pulse h-28" />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-card rounded-xl p-6 border border-foreground/10 animate-pulse space-y-3">
              <div className="h-4 w-24 bg-foreground/10 rounded" />
              <div className="w-full h-3 bg-foreground/10 rounded-full" />
              <div className="h-4 w-32 bg-foreground/10 rounded" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-foreground/10 animate-pulse space-y-4">
              <div className="h-4 w-28 bg-foreground/10 rounded" />
              <div className="h-8 w-48 bg-foreground/10 rounded" />
              <div className="h-10 bg-foreground/10 rounded-xl" />
            </div>
            <div className="bg-card rounded-2xl p-6 border border-foreground/10 animate-pulse space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-foreground/10 mx-auto" />
              <div className="h-5 w-24 bg-foreground/10 rounded mx-auto" />
              <div className="h-8 w-40 bg-foreground/10 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
