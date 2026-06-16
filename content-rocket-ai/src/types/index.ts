export type Platform = "TIKTOK" | "INSTAGRAM" | "YOUTUBE" | "FACEBOOK";
export type ContentType =
  | "VIDEO_IDEAS"
  | "VIRAL_HOOKS"
  | "FULL_SCRIPT"
  | "CTA"
  | "HASHTAGS"
  | "YOUTUBE_TITLE"
  | "DESCRIPTION"
  | "EDITORIAL_CALENDAR";
export type Plan = "FREE" | "PRO" | "AGENCY";

export interface GeneratorFormData {
  niche: string;
  audience: string;
  objective: string;
  platform: Platform;
  contentType: ContentType;
}

export interface GenerationResult {
  id: string;
  type: ContentType;
  content: unknown;
  createdAt: string;
  platform: Platform;
  niche: string;
}
