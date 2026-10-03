export function LoadingSpinner() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-6 px-6">
      {/* A wobbly circle being drawn over and over */}
      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-[52%_48%_45%_55%/48%_52%_48%_52%] border-[3px] border-dashed border-foreground" />
        <div className="absolute inset-2.5 animate-[spin_3s_linear_infinite_reverse] rounded-[45%_55%_52%_48%/52%_45%_55%_48%] border-2 border-dashed border-foreground/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-pulse rounded-[50%_45%_55%_45%/45%_55%_45%_55%] border-2 border-foreground bg-primary" />
        </div>
      </div>
      <p className="animate-pulse font-headline text-xl font-bold text-muted-foreground">
        Loading dashboard…
      </p>
    </div>
  );
}
