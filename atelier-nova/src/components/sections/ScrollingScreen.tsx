"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getMedia } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * La capture pleine page défile DANS le navigateur au rythme du défilement
 * de la page : on « visite » le site du concept sans quitter l’étude de cas.
 */
export function ScrollingScreen({ src, alt, url }: { src: string; alt: string; url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const m = getMedia(src, { width: 1440, height: 5000 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const screen = screenRef.current;
    const img = imgRef.current;
    if (!wrap || !screen || !img || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const max = img.offsetHeight - screen.offsetHeight;
      img.style.transform = `translate3d(0, ${-max * p}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[260vh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center motion-reduce:static motion-reduce:h-auto">
        <figure className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-[10px] bg-[#1b1b1a] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.06)]">
          <div aria-hidden="true" className="flex h-9 items-center gap-3 px-4 text-[#9d9a93]">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
              <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
              <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
            </span>
            <span className="mx-auto flex h-6 max-w-[60%] flex-1 items-center justify-center truncate rounded-md bg-white/5 px-3 text-[11px] tracking-wide">
              {url}
            </span>
            <span className="w-[42px]" />
          </div>
          <div ref={screenRef} className="relative aspect-[16/10] max-h-[calc(100svh-8rem)] w-full overflow-hidden">
            <Image
              ref={imgRef}
              src={m.src}
              alt={alt}
              width={m.width}
              height={m.height}
              sizes="(min-width: 1280px) 1240px, 94vw"
              placeholder={m.blurDataURL ? "blur" : "empty"}
              blurDataURL={m.blurDataURL || undefined}
              className="absolute inset-x-0 top-0 h-auto w-full will-change-transform"
            />
          </div>
        </figure>
      </div>
    </div>
  );
}
