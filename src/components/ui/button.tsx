import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Wobbly oval, chunky pencil border, hard offset shadow that shrinks on
  // hover and vanishes on press so the button "presses flat".
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap border-[3px] border-foreground bg-card font-body font-medium leading-none transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1.15em] [&_svg]:shrink-0 [&_svg]:stroke-[2.5]",
  {
    variants: {
      variant: {
        default:
          "text-foreground shadow-sketch hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-primary hover:text-primary-foreground hover:shadow-sketch-sm",
        destructive:
          "bg-primary text-primary-foreground shadow-sketch hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:shadow-sketch-sm",
        secondary:
          "bg-secondary text-foreground shadow-sketch hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-accent hover:text-accent-foreground hover:shadow-sketch-sm",
        outline:
          "text-foreground shadow-sketch-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-secondary hover:shadow-none",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:bg-secondary active:translate-x-[2px] active:translate-y-[2px]",
        link: "border-transparent bg-transparent text-foreground underline-offset-4 shadow-none hover:text-accent hover:underline",
      },
      size: {
        default: "h-11 rounded-md px-4 text-lg md:h-10 md:text-base",
        sm: "h-10 rounded-sm px-3 text-base md:h-9 md:text-[0.95rem]",
        lg: "h-12 rounded-md px-6 text-xl md:h-14 md:px-8 md:text-2xl",
        icon: "h-11 w-11 rounded-md md:h-10 md:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
