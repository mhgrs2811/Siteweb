"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25": variant === "default",
            "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800": variant === "outline",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            "underline-offset-4 hover:underline text-violet-600": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
