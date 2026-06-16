import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300": variant === "default",
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300": variant === "secondary",
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300": variant === "destructive",
          "border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300": variant === "outline",
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300": variant === "success",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
