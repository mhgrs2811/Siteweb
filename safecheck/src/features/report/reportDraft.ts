import { z } from 'zod';

import { REPORT_CATEGORIES, type ContactChannel, type Identifier, type ReportCategory } from '@/domain';

/** Brouillon de signalement, construit étape par étape. */
export interface ReportDraft {
  identifier: Identifier | null;
  category: ReportCategory | null;
  channel: ContactChannel | null;
  description: string;
  hadFinancialLoss: boolean | null;
}

export const EMPTY_DRAFT: ReportDraft = {
  identifier: null,
  category: null,
  channel: null,
  description: '',
  hadFinancialLoss: null,
};

export const REPORT_STEPS = ['identifier', 'category', 'details', 'confirm'] as const;
export type ReportStep = (typeof REPORT_STEPS)[number];

/** Détection grossière de données personnelles pour prévenir l'utilisateur (jamais bloquant côté client seul). */
const PII_PATTERNS = [
  /\b\d{13,19}\b/, // numéro de carte compact
  /\b(?:\d{4}[ -]?){3}\d{4}\b/, // numéro de carte espacé
  /\b0\d(?:[ .-]?\d{2}){4}\b/, // numéro de téléphone français
];

export const DescriptionSchema = z
  .string()
  .max(2000)
  .refine((s) => !PII_PATTERNS.some((re) => re.test(s)), { message: 'pii' });

export const CategorySchema = z.enum(REPORT_CATEGORIES as [ReportCategory, ...ReportCategory[]]);

export function canProceed(step: ReportStep, draft: ReportDraft): boolean {
  switch (step) {
    case 'identifier':
      return draft.identifier !== null;
    case 'category':
      return draft.category !== null && CategorySchema.safeParse(draft.category).success;
    case 'details':
      return DescriptionSchema.safeParse(draft.description).success;
    case 'confirm':
      return draft.identifier !== null && draft.category !== null;
  }
}
