import { NextResponse } from "next/server";
import { contact } from "@/content";
import { site } from "@/config/site";
import { normalizeUrl, validateBrief, type Brief } from "@/lib/brief";

/**
 * Réception du brief projet.
 * Envoi par e-mail via l’API Resend (https://resend.com) quand RESEND_API_KEY
 * est défini. Sans configuration, la route répond 503 « not_configured » :
 * le formulaire l’indique honnêtement et propose l’e-mail direct.
 *
 * Anti-spam : champ piège invisible, délai minimal de remplissage,
 * limitation de débit par adresse IP (en mémoire, par instance).
 */

const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // 1. Champ piège : un humain ne le voit pas, un robot le remplit.
  if (typeof body.nickname === "string" && body.nickname.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  // 2. Formulaire rempli trop vite (< 3 s) : probablement automatisé.
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < 3000) {
    return NextResponse.json({ ok: false, code: "too_fast" }, { status: 400 });
  }
  // 3. Limitation de débit.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const brief: Brief = {
    firstName: str("firstName"),
    lastName: str("lastName"),
    email: str("email"),
    company: str("company"),
    projectType: str("projectType"),
    budget: str("budget"),
    timeline: str("timeline"),
    description: str("description"),
    website: str("website"),
    consent: body.consent === true,
    plan: str("plan"),
  };
  const errors = validateBrief(brief, {
    projectTypes: contact.projectTypes.map((o) => o.value),
    budgets: contact.budgets.map((o) => o.value),
    timelines: contact.timelines.map((o) => o.value),
  });
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, code: "invalid", errors }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;
  const rows: [string, string][] = [
    ["Nom", `${brief.firstName} ${brief.lastName}`],
    ["E-mail", brief.email],
    ["Entreprise", brief.company || "—"],
    ["Type de projet", label(contact.projectTypes, brief.projectType)],
    ["Formule envisagée", brief.plan || "—"],
    ["Budget", label(contact.budgets, brief.budget)],
    ["Délai", label(contact.timelines, brief.timeline)],
    ["Site existant", brief.website ? normalizeUrl(brief.website) : "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join("\n")}\n\n${brief.description}`;
  const html = `<h2 style="font-family:Georgia,serif">Nouveau brief projet</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap;font-size:15px;line-height:1.6">${esc(brief.description)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: brief.email,
        subject: `Brief — ${label(contact.projectTypes, brief.projectType)} — ${brief.firstName} ${brief.lastName}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend a répondu", res.status, await res.text());
      return NextResponse.json({ ok: false, code: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] échec d’envoi", err);
    return NextResponse.json({ ok: false, code: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
