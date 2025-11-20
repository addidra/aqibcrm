import * as React from "react"

import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning"
}

const variantClassMap: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  outline: "border border-border text-foreground",
  success: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variantClassMap[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
Badge.displayName = "Badge"

export { Badge }

