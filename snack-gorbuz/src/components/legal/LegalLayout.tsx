import type { ReactNode } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import styles from "./LegalLayout.module.css";

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className={styles.section} data-reveal>
      <h2 className={`display ${styles.h2}`}>{title}</h2>
      <div className={`prose ${styles.content}`}>{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string | null;
}

/** Champ légal : valeur réelle, ou puce « à compléter » explicitement interne. */
export function LegalField({ label, value }: FieldProps) {
  return (
    <div className={styles.field}>
      <dt className={styles.fieldLabel}>{label}</dt>
      <dd className={styles.fieldValue}>
        {value ? value : <span className={`ticket ticket--dashed ${styles.todo}`}>À compléter</span>}
      </dd>
    </div>
  );
}

export function LegalFields({ children }: { children: ReactNode }) {
  return <dl className={styles.fields}>{children}</dl>;
}

interface LegalLayoutProps {
  chapter: string;
  label: string;
  title: string;
  lead: string;
  banner: string | null;
  updatedAt: string | null;
  children: ReactNode;
}

export function LegalLayout({ chapter, label, title, lead, banner, updatedAt, children }: LegalLayoutProps) {
  return (
    <>
      <PageIntro chapter={chapter} label={label} title={title} lead={lead} compact />
      <div className={`${styles.body} theme-light`}>
        <div className={`container ${styles.inner}`}>
          {banner && (
            <p className={styles.banner} role="note">
              {banner}
            </p>
          )}
          {children}
          <p className={`${styles.updated} muted`}>
            Dernière mise à jour :{" "}
            {updatedAt ? new Date(updatedAt).toLocaleDateString("fr-BE", { dateStyle: "long" }) : <span className="ticket ticket--dashed">À compléter</span>}
          </p>
        </div>
      </div>
    </>
  );
}
