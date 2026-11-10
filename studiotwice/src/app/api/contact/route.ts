import { NextResponse } from "next/server";
import { Resend } from "resend";

interface Payload {
  name?: string;
  business?: string;
  reach?: string;
  message?: string;
  summary?: string;
  website?: string;
}

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);

/**
 * Réception du formulaire de contact et envoi par Resend.
 * Variables d'environnement : RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 */
export async function POST(req: Request) {
  let body: Payload;
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) body = (await req.json()) as Payload;
    else body = Object.fromEntries((await req.formData()).entries()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Champ piège rempli : on répond comme si tout allait bien, sans rien envoyer.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const business = clean(body.business, 160);
  const reach = clean(body.reach, 200);
  const message = clean(body.message, 4000);
  const summary = clean(body.summary, 4000);
  if (!name || !business || !reach) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "StudioTwice <onboarding@resend.dev>";
  if (!key || !to) {
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const text = [
    `Nom : ${name}`,
    `Commerce : ${business}`,
    `Contact : ${reach}`,
    "",
    message ? `Message :\n${message}` : "Pas de message.",
    "",
    summary ? `Estimation :\n${summary}` : "",
  ].join("\n");

  const html = `<div style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1b1816">
    <p><b>Nom</b> : ${escape(name)}<br><b>Commerce</b> : ${escape(business)}<br><b>Contact</b> : ${escape(reach)}</p>
    ${message ? `<p><b>Message</b><br>${escape(message).replace(/\n/g, "<br>")}</p>` : ""}
    ${summary ? `<p><b>Estimation</b><br>${escape(summary).replace(/\n/g, "<br>")}</p>` : ""}
  </div>`;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: /\S+@\S+\.\S+/.test(reach) ? reach : undefined,
      subject: `Demande de site : ${business}`,
      text,
      html,
    });
    if (error) throw error;
    if (!type.includes("application/json")) {
      return NextResponse.redirect(new URL("/?envoye=1#contact", req.url), 303);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  }
}
