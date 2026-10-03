import * as React from "react"

import { cn } from "@/lib/utils"

type CardDecoration = "none" | "tape" | "tack"

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Physical decoration pinned to the top edge of the card */
  decoration?: CardDecoration
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, decoration = "none", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // White paper sheet, wobbly pencil border, flat cut-paper depth
        "relative rounded-lg border-2 border-foreground bg-card text-card-foreground shadow-sketch-soft transition-transform duration-100",
        className
      )}
      {...props}
    >
      {decoration === "tape" && <span className="sketch-tape" aria-hidden="true" />}
      {decoration === "tack" && <span className="sketch-tack" aria-hidden="true" />}
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-headline text-xl font-bold leading-tight tracking-tight sm:text-2xl",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
