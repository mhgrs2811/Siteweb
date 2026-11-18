import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** Logotype typographique, construit depuis `site.name`. */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const parts = site.name.split(" ");
  const last = parts.pop() ?? site.name;
  const first = parts.join(" ");
  return (
    <span className={cn("inline-flex items-baseline gap-[0.35em] leading-none whitespace-nowrap", className)}>
      {first ? (
        <span className={cn("font-sans font-semibold uppercase", size === "lg" ? "text-[1.1rem] tracking-[0.22em]" : "text-[0.8rem] tracking-[0.24em]")}>
          {first}
        </span>
      ) : null}
      {first ? <span className="sr-only"> </span> : null}
      <span className={cn("t-it", size === "lg" ? "text-[2rem]" : "text-[1.55rem]")}>
        {last}
        <span aria-hidden="true" className="ml-[0.06em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-nova align-baseline" />
      </span>
    </span>
  );
}
