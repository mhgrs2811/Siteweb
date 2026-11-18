/**
 * Typographie française automatique : espace insécable avant ; : ! ? »
 * et après «. Appliquée aux contenus éditoriaux au chargement du module.
 */
const NNBSP = " "; // espace fine insécable
const NBSP = " ";

export function frTypo(input: string): string {
  return input
    .replace(/ ([;!?])/g, `${NNBSP}$1`)
    .replace(/ :(?=\s|$)/g, `${NBSP}:`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/'/g, "’");
}

export function deepTypo<T>(value: T): T {
  if (typeof value === "string") return frTypo(value) as T;
  if (Array.isArray(value)) return value.map((v) => deepTypo(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      // Les clés techniques (chemins, slugs, couleurs, liens) ne sont pas touchées.
      out[k] = /^(slug|href|src|image|images|id|color|bg|fg|accent|cover|theme|category|anchor|icon|mockups)$/i.test(k)
        ? v
        : deepTypo(v);
    }
    return out as T;
  }
  return value;
}
