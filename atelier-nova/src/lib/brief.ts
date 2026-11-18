/**
 * Validation du brief, partagée entre le formulaire (client) et la route API (serveur).
 */
export type Brief = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  website: string;
  consent: boolean;
  plan?: string;
};

export type BriefErrors = Partial<Record<keyof Brief, true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export function validateBrief(b: Brief, allowed: { projectTypes: string[]; budgets: string[]; timelines: string[] }): BriefErrors {
  const e: BriefErrors = {};
  if (!b.firstName.trim() || b.firstName.length > 80) e.firstName = true;
  if (!b.lastName.trim() || b.lastName.length > 80) e.lastName = true;
  if (!EMAIL.test(b.email.trim()) || b.email.length > 160) e.email = true;
  if (!allowed.projectTypes.includes(b.projectType)) e.projectType = true;
  if (!allowed.budgets.includes(b.budget)) e.budget = true;
  if (!allowed.timelines.includes(b.timeline)) e.timeline = true;
  if (b.description.trim().length < 30 || b.description.length > 5000) e.description = true;
  if (b.website.trim()) {
    try {
      const u = new URL(normalizeUrl(b.website));
      if (!u.hostname.includes(".")) e.website = true;
    } catch {
      e.website = true;
    }
  }
  if (b.company.length > 120) e.company = true;
  if (!b.consent) e.consent = true;
  return e;
}
