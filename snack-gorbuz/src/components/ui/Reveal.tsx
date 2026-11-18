"use client";

import { useInView } from "@/lib/hooks";
import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Décalage d’apparition (×90 ms). */
  delay?: number;
  id?: string;
  style?: CSSProperties;
}

/** Révélation discrète à l’entrée dans le viewport (opacité + translation courte). */
export function Reveal({ children, as: Tag = "div", className, delay = 0, id, style }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      className={[className, inView ? "is-in" : ""].filter(Boolean).join(" ")}
      style={{ ...style, ["--reveal-delay" as string]: delay } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
