import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const CONTENT_PROMPTS = {
  VIDEO_IDEAS: (niche: string, audience: string, objective: string, platform: string) =>
    `Tu es un expert en création de contenu viral pour ${platform}. Génère 10 idées de vidéos uniques et virales pour la niche "${niche}", ciblant "${audience}" avec l'objectif de "${objective}". 
    Format JSON: { "ideas": [{ "title": "...", "concept": "...", "hook": "...", "viral_potential": "high/medium", "estimated_views": "..." }] }`,

  VIRAL_HOOKS: (niche: string, audience: string, objective: string, platform: string) =>
    `Tu es un expert en hooks viraux pour ${platform}. Crée 15 hooks ultra-accrocheurs pour la niche "${niche}", ciblant "${audience}".
    Format JSON: { "hooks": [{ "hook": "...", "type": "question/statement/shocking/emotional", "why_it_works": "..." }] }`,

  FULL_SCRIPT: (niche: string, audience: string, objective: string, platform: string) =>
    `Écris un script vidéo complet et viral pour ${platform} dans la niche "${niche}", pour "${audience}", objectif: "${objective}".
    Format JSON: { "script": { "hook": "...", "intro": "...", "body": [...], "cta": "...", "outro": "...", "duration": "...", "hashtags": [...] } }`,

  CTA: (niche: string, audience: string, objective: string, platform: string) =>
    `Crée 10 CTA (appels à l'action) puissants pour ${platform} dans la niche "${niche}" pour "${audience}".
    Format JSON: { "ctas": [{ "cta": "...", "type": "follow/like/comment/share/click", "placement": "début/milieu/fin" }] }`,

  HASHTAGS: (niche: string, audience: string, objective: string, platform: string) =>
    `Génère une stratégie de hashtags optimisée pour ${platform}, niche "${niche}".
    Format JSON: { "strategy": { "mega": [...], "large": [...], "medium": [...], "niche": [...], "branded": [...], "recommended_mix": "..." } }`,

  YOUTUBE_TITLE: (niche: string, audience: string, objective: string, platform: string) =>
    `Génère 10 titres YouTube optimisés SEO et click-bait éthique pour la niche "${niche}", audience "${audience}".
    Format JSON: { "titles": [{ "title": "...", "seo_score": "1-10", "click_potential": "high/medium", "keywords": [...] }] }`,

  DESCRIPTION: (niche: string, audience: string, objective: string, platform: string) =>
    `Écris 5 descriptions optimisées pour ${platform}, niche "${niche}", audience "${audience}", objectif "${objective}".
    Format JSON: { "descriptions": [{ "description": "...", "character_count": 0, "includes_cta": true, "seo_keywords": [...] }] }`,

  EDITORIAL_CALENDAR: (niche: string, audience: string, objective: string, platform: string) =>
    `Crée un calendrier éditorial de 30 jours pour ${platform}, niche "${niche}", audience "${audience}".
    Format JSON: { "calendar": [{ "day": 1, "date": "...", "content_type": "...", "topic": "...", "hook": "...", "best_time": "...", "hashtags": [...] }] }`,
};
