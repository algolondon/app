export default function CourseLibraryLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Shimmer header bar */}
      <div className="h-[72px] bg-card border-b border-foreground/10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page title skeleton */}
        <div className="mb-10 animate-pulse space-y-3">
          <div className="h-8 w-48 bg-foreground/10 rounded" />
          <div className="h-4 w-72 bg-foreground/10 rounded" />
        </div>

        {/* Course cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-foreground/10 overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Thumbnail */}
              <div className="w-full h-44 bg-foreground/10" />
              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="h-5 bg-foreground/10 rounded w-4/5" />
                <div className="h-4 bg-foreground/10 rounded w-3/5" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-20 bg-foreground/10 rounded" />
                  <div className="h-8 w-24 bg-foreground/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
