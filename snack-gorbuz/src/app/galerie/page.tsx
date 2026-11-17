import type { Metadata } from "next";
import { copy } from "@/data/copy";
import { hasRealMedia } from "@/data/galleryData";
import { buildMetadata, seoPages } from "@/data/seoData";
import { PageIntro } from "@/components/layout/PageIntro";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import styles from "./page.module.css";

export const metadata: Metadata = { ...buildMetadata(seoPages.gallery), title: { absolute: seoPages.gallery.title } };

/**
 * /galerie — H1 « L'univers Snack Gorbuz », H2 produits / lieu / équipe.
 * Emplacements réservés aux vraies photos ; aucun faux visuel.
 */
export default function GalleryPage() {
  const g = copy.gallery;
  return (
    <>
      <PageIntro
        chapter="03"
        label={copy.nav.gallery}
        title={g.h1}
        lead={g.lead}
        aside={!hasRealMedia() ? <span className="ticket ticket--dashed">{copy.provisional.mediaPending}</span> : undefined}
      />
      <section className={`${styles.body} theme-light`}>
        <div className="container">
          {!hasRealMedia() && <p className={`${styles.note} muted`}>{g.pendingNote}</p>}
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
