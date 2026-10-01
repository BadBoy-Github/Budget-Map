export function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      {/* Outer ring */}
      <div className="relative h-16 w-16">
        {/* Track ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        {/* Spinning arc */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary/70" />
        </div>
      </div>
      <p className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse">
        Loading dashboard…
      </p>
    </div>
  );
}
