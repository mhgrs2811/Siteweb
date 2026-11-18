import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";

export const metadata: Metadata = {
  title: { absolute: seo.notFound.title },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section
      className="tone-dark section"
      style={{ minHeight: "100svh", display: "flex", alignItems: "center", paddingTop: "var(--header-h)" }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <p className="chapter">
          <span className="chapter-num" aria-hidden="true">
            404
          </span>
          <span>Page introuvable</span>
        </p>
        <h1 className="display display-xl" style={{ maxWidth: "12ch" }}>
          {copy.notFound.title}
        </h1>
        <p className="lead muted">{copy.notFound.text}</p>
        <div>
          <Link href="/" className="btn btn-primary btn-lg">
            {copy.notFound.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
