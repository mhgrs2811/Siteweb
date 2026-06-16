"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 transition-all",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";
export { Select };
