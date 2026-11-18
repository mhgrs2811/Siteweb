import Image from "next/image";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/cn";

/**
 * Mockup de navigateur. Avec `scrollOnHover`, la capture pleine page défile
 * lentement au survol, comme si l’on parcourait le site.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  className,
  sizes = "(min-width: 1024px) 50vw, 90vw",
  priority,
  scrollOnHover = false,
  tone = "dark",
  aspect = "16 / 10",
}: {
  src: string;
  alt: string;
  url: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  scrollOnHover?: boolean;
  tone?: "dark" | "light";
  aspect?: string;
}) {
  const m = getMedia(src, { width: 1440, height: 900 });
  return (
    <figure
      className={cn(
        "browser-frame overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55),0_0_0_1px_rgb(255_255_255/0.06)]",
        tone === "dark" ? "bg-[#1b1b1a]" : "bg-[#e9e6df]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 items-center gap-3 px-4",
          tone === "dark" ? "text-[#9d9a93]" : "text-[#5f5c56]",
        )}
        aria-hidden="true"
      >
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
        </span>
        <span
          className={cn(
            "mx-auto flex h-6 max-w-[60%] flex-1 items-center justify-center truncate rounded-md px-3 text-[11px] tracking-wide",
            tone === "dark" ? "bg-white/5" : "bg-black/5",
          )}
        >
          {url}
        </span>
        <span className="w-[42px]" />
      </div>
      <div
        className={cn("relative overflow-hidden", scrollOnHover && "browser-scroll")}
        style={{ aspectRatio: aspect, "--fh": `${frameHeight(aspect)}cqw` } as React.CSSProperties}
      >
        <Image
          src={m.src}
          alt={alt}
          width={m.width}
          height={m.height}
          sizes={sizes}
          priority={priority}
          placeholder={m.blurDataURL ? "blur" : "empty"}
          blurDataURL={m.blurDataURL || undefined}
          className={cn("absolute inset-x-0 top-0 h-auto w-full", !scrollOnHover && "h-full object-cover object-top")}
        />
      </div>
    </figure>
  );
}

function frameHeight(aspect: string) {
  const [w, h] = aspect.split("/").map((n) => parseFloat(n));
  return (h / w) * 100;
}

/** Mockup de téléphone. */
export function PhoneFrame({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 16vw, 40vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const m = getMedia(src, { width: 780, height: 1688 });
  return (
    <figure
      className={cn(
        "phone-frame relative overflow-hidden rounded-[2.2rem] bg-[#0b0b0b] p-[7px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.08)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.75rem]" style={{ aspectRatio: "390 / 844" }}>
        <Image
          src={m.src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder={m.blurDataURL ? "blur" : "empty"}
          blurDataURL={m.blurDataURL || undefined}
          className="object-cover object-top"
        />
        <span aria-hidden="true" className="absolute left-1/2 top-2 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </figure>
  );
}
