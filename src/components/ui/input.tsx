import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Full wobbly box (not an underline) with a ballpoint-blue focus
          "flex h-12 w-full rounded-md border-2 border-foreground bg-card px-3 py-2 text-lg font-body text-card-foreground transition-colors placeholder:text-foreground/40 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50 md:text-[1.05rem] md:file:text-sm md:file:font-medium file:border-0 file:bg-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
