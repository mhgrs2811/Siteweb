/**
 * Deux façons de vivre le premier écran.
 *   calm : scène posée, le site fini dès l'arrivée ; la construction a sa propre section juste après.
 *   loop : les plaques passent d'elles-mêmes du croquis au site fini, en boucle lente, sans défilement.
 * Réglage : NEXT_PUBLIC_HERO_MODE=calm|loop au build (défaut : calm).
 */
export type HeroMode = "calm" | "loop";

export const HERO_MODE: HeroMode = process.env.NEXT_PUBLIC_HERO_MODE === "loop" ? "loop" : "calm";
