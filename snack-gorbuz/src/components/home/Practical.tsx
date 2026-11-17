import { copy } from "@/data/copy";
import { routes } from "@/lib/routes";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PracticalBlocks } from "@/components/practical/PracticalBlocks";
import { SectionHead } from "@/components/ui/SectionHead";
import Link from "next/link";
import styles from "./Practical.module.css";

/**
 * SECTION 07 — INFORMATIONS PRATIQUES
 * Fond charbon, trois blocs conditionnels adresse / horaires / contact.
 */
export function Practical() {
  const p = copy.home.practical;
  return (
    <section className={`${styles.section} theme-dark`} aria-labelledby="pratique-title">
      <div className="container">
        <div className={styles.head}>
          <SectionHead chapter={p.chapter} label={p.label} title={p.h2} id="pratique-title" />
          <Link href={routes.contact} className={`link ${styles.more}`} data-reveal>
            {p.cta}
            <ArrowUpRight />
          </Link>
        </div>
        <PracticalBlocks headings={{ address: p.h3Address, hours: p.h3Hours, contact: p.h3Contact }} />
      </div>
    </section>
  );
}
