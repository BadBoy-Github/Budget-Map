import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border-2 border-foreground px-2.5 py-0.5 font-body text-sm font-medium leading-tight transition-colors [&_svg]:stroke-[2.5]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-primary text-primary-foreground",
        outline: "bg-card text-foreground hover:bg-secondary",
        postit: "bg-postit text-postit-foreground",
      },
      shape: {
        wobbly: "rounded-wobbly",
        soft: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "wobbly",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
