import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/layout/PageHero";
import { copy } from "@/data/copy";
import { galleryByCategory } from "@/data/gallery";
import { seo } from "@/data/seo";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: seo.gallery.title },
  description: seo.gallery.description,
  openGraph: { title: seo.gallery.title, description: seo.gallery.description },
};

const sections = [
  { id: "produits", title: copy.galleryPage.productsTitle, category: "produits" as const },
  { id: "lieu", title: copy.galleryPage.placeTitle, category: "lieu" as const },
  { id: "equipe", title: copy.galleryPage.teamTitle, category: "equipe" as const },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        tone="light"
        number="04"
        label={copy.nav.gallery}
        title={copy.galleryPage.title}
        lead={copy.galleryPage.lead}
        ghost="Galerie"
      />

      <nav className={s.nav} aria-label={copy.galleryPage.navLabel}>
        <div className={`container ${s.navInner}`}>
          {sections.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className={s.navLink}>
              {sec.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="tone-light">
        {sections.map((sec) => {
          const items = galleryByCategory(sec.category);
          const realCount = items.filter((i) => i.src).length;
          return (
            <section key={sec.id} id={sec.id} className={s.section} aria-labelledby={`galerie-${sec.id}`}>
              <div className="container">
                <div className={s.head}>
                  <h2 id={`galerie-${sec.id}`} className="display display-l">
                    {sec.title}
                  </h2>
                  <span className={s.count}>
                    {realCount > 0
                      ? `${realCount} photo${realCount > 1 ? "s" : ""}`
                      : `${items.length} emplacement${items.length > 1 ? "s" : ""} à compléter`}
                  </span>
                </div>
                <GalleryGrid items={items} />
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
