import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "ghost" | "ink" | "cream";

interface BaseProps {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: boolean;
  className?: string;
  children: ReactNode;
}

type LinkProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

const variantClass: Record<Variant, string> = {
  primary: "",
  ghost: "btn--ghost",
  ink: "btn--ink",
  cream: "btn--cream",
};

/**
 * Bouton / lien d'action. Rend un <Link> Next quand `href` est fourni,
 * un <button> sinon. Les états hover/focus/active sont gérés dans globals.css.
 */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", icon = true, className, children } = props;
  const cls = ["btn", variantClass[variant], size === "lg" ? "btn--lg" : "", className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && typeof props.href === "string") {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...rest } = props;
    void _v;
    void _s;
    void _i;
    void _c;
    void _ch;
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
          <span>{children}</span>
          {icon && <ArrowRight />}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        <span>{children}</span>
        {icon && <ArrowRight />}
      </Link>
    );
  }

  const { variant: _v, size: _s, icon: _i, className: _c, children: _ch, href: _h, ...rest } = props as ButtonProps;
  void _v;
  void _s;
  void _i;
  void _c;
  void _ch;
  void _h;
  return (
    <button type="button" className={cls} {...rest}>
      <span>{children}</span>
      {icon && <ArrowRight />}
    </button>
  );
}
