import { media, type MediaInfo } from "@/content/generated/media";

/** Dimensions et placeholder flou d’une image du dossier public. */
export function getMedia(src: string, fallback: { width: number; height: number } = { width: 1600, height: 1000 }): MediaInfo {
  return media[src] ?? { src, width: fallback.width, height: fallback.height, blurDataURL: "" };
}
