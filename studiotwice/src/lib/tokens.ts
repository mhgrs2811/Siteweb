/** Couleurs du site. Une seule source de vérité, reprise en CSS dans globals.css. */
export const COLORS = {
  night: "#1A1715",
  sand: "#EFEBE6",
  lin: "#FBF9F6",
  ink: "#211D1A",
  ink2: "#6E6660",
  sandOnNight: "#B8AEA5",
  taupe: "#A39389",
  light: "#FFF8F1",
  accent: "#2A4BEB",
  ruleDark: "rgba(33, 29, 26, 0.14)",
  ruleLight: "rgba(251, 249, 246, 0.18)",
} as const;

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Part de « jour » dans la séquence : la nuit du croquis devient le jour de la mise en ligne. */
export const dayFromProgress = (p: number) => smoothstep(0.55, 0.95, p);

/** Seuils des six étapes de la construction. */
export const STEP_THRESHOLDS = [0.12, 0.32, 0.55, 0.76, 0.92];

export const stepFromProgress = (p: number) => {
  let i = 0;
  while (i < STEP_THRESHOLDS.length && p >= STEP_THRESHOLDS[i]) i++;
  return i;
};
