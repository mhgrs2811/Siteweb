/**
 * POST /api/reservation · fonction Cloudflare Pages
 *
 * Reçoit une demande de réservation envoyée par public/reserver.html, la vérifie,
 * l'envoie au restaurant, puis envoie un accusé de réception au client.
 *
 * L'adresse e-mail du restaurant reste côté serveur : elle n'apparaît ni dans
 * le code du site, ni dans l'accusé de réception envoyé au client. L'e-mail
 * reçu par le restaurant n'a volontairement pas de « répondre à » vers le
 * client : une réponse depuis la boîte du propriétaire dévoilerait son adresse.
 *
 * Variables (Cloudflare Pages › Settings › Variables and secrets) :
 *   BREVO_API_KEY     secret      clé API Brevo, pour l'envoi des e-mails
 *   RESTAURANT_EMAIL  secret      adresse qui reçoit les demandes
 *   SENDER_EMAIL                  expéditeur vérifié dans Brevo, ex. reservations@haspidekebap.be
 *   SENDER_NAME                   facultatif, « Has Pide Kebap » par défaut
 *   TURNSTILE_SECRET  secret      facultatif, active la vérification anti-robot Cloudflare Turnstile
 *   BREVO_API_URL                 facultatif, pour les tests uniquement
 * Liaison KV facultative : RATE_LIMIT (limite le nombre de demandes par adresse IP)
 */

// Doit rester aligné sur HOURS et RESERVATION dans public/assets/js/main.js
const HOURS = {
  0: ["11:00", "23:00"],
  1: ["11:00", "23:00"],
  2: ["11:00", "23:00"],
  3: ["11:00", "23:00"],
  4: ["11:00", "23:00"],
  5: ["11:00", "23:00"],
  6: ["11:00", "23:00"]
};

const RULES = {
  maxGuests: 12,
  maxDaysAhead: 60,
  slotStep: 30,
  lastSlotBeforeClose: 60,
  minNotice: 45,        // 60 min côté site, 15 min de marge pour les horloges décalées
  minFillMs: 3000,      // un humain met plus de 3 s à remplir le formulaire
  perIpPerHour: 5,
  maxBodyBytes: 8 * 1024,
  maxNotes: 500
};

const RESTAURANT = {
  name: "Has Pide Kebap",
  phone: "02 203 83 00",
  phoneIntl: "+3222038300",
  address: "Chaussée de Haecht 115, 1030 Schaerbeek",
  timeZone: "Europe/Brussels"
};

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const LINK_RE = /(https?:\/\/|www\.|\[url|<a\s)/i;

export async function onRequestPost({ request, env }) {
  // Même site uniquement
  const origin = request.headers.get("Origin");
  if (origin && safeHost(origin) !== new URL(request.url).host) {
    return json({ error: "origin" }, 403);
  }

  if (Number(request.headers.get("Content-Length") || 0) > RULES.maxBodyBytes) {
    return json({ error: "too_large" }, 413);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return json({ error: "bad_request" }, 400);
  }

  // Robot probable (champ piège rempli, ou formulaire rempli en moins de 3 s) :
  // on répond comme si tout allait bien, sans rien envoyer.
  if (data.website || !(Number(data.elapsed) >= RULES.minFillMs)) {
    return json({ ok: true });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";

  if (env.TURNSTILE_SECRET) {
    const human = await verifyTurnstile(env.TURNSTILE_SECRET, data.turnstile, ip);
    if (!human) return json({ error: "captcha" }, 400);
  }

  const { booking, errors } = validate(data);
  if (errors.length) return json({ error: "invalid", fields: errors }, 422);

  if (env.RATE_LIMIT && !(await allowRequest(env.RATE_LIMIT, ip || "unknown"))) {
    return json({ error: "rate_limited" }, 429);
  }

  if (!env.BREVO_API_KEY || !env.RESTAURANT_EMAIL || !env.SENDER_EMAIL) {
    console.error("reservation: variables BREVO_API_KEY, RESTAURANT_EMAIL ou SENDER_EMAIL manquantes");
    return json({ error: "not_configured" }, 500);
  }

  const sender = { email: env.SENDER_EMAIL, name: env.SENDER_NAME || RESTAURANT.name };

  try {
    await sendEmail(env, {
      sender,
      to: [{ email: env.RESTAURANT_EMAIL }],
      ...restaurantEmail(booking)
    });
  } catch (err) {
    console.error("reservation: envoi au restaurant impossible", err);
    return json({ error: "send_failed" }, 502);
  }

  if (booking.email) {
    try {
      await sendEmail(env, { sender, to: [{ email: booking.email }], ...clientEmail(booking) });
    } catch (err) {
      // La demande est bien arrivée au restaurant : on ne bloque pas le client pour autant.
      console.error("reservation: accusé de réception impossible", err);
    }
  }

  return json({ ok: true });
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export function validate(d, now = new Date()) {
  const errors = [];
  const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const guests = Number(d.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > RULES.maxGuests) errors.push("guests");

  const date = text(d.date, 10);
  const time = text(d.time, 5);
  const today = isoInZone(now, RESTAURANT.timeZone);
  if (!isRealDate(date) || date < today || date > addDays(today, RULES.maxDaysAhead) || !HOURS[weekday(date)]) {
    errors.push("date");
  } else if (!isValidSlot(date, time, date === today ? minutesInZone(now, RESTAURANT.timeZone) + RULES.minNotice : -1)) {
    errors.push("time");
  }

  const name = text(d.name, 80);
  if (name.length < 2 || /[<>]/.test(name) || LINK_RE.test(name)) errors.push("name");

  const phone = text(d.phone, 30);
  const digits = phone.replace(/\D/g, "");
  if (!/^[0-9+()./\s-]+$/.test(phone) || digits.length < 9 || digits.length > 15) errors.push("phone");

  const email = text(d.email, 254);
  if (email && !EMAIL_RE.test(email)) errors.push("email");

  const notes = typeof d.notes === "string" ? d.notes.trim() : "";
  if (notes.length > RULES.maxNotes || LINK_RE.test(notes)) errors.push("notes");

  if (d.consent !== true) errors.push("consent");

  return { errors, booking: { guests, date, time, name, phone, email, notes } };
}

function isValidSlot(date, time, earliest) {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const hours = HOURS[weekday(date)];
  const minutes = toMinutes(time);
  const first = toMinutes(hours[0]);
  const last = toMinutes(hours[1]) - RULES.lastSlotBeforeClose;
  return minutes >= first && minutes <= last && (minutes - first) % RULES.slotStep === 0 && minutes >= earliest;
}

/* ------------------------------------------------------------------ */
/* E-mails                                                             */
/* ------------------------------------------------------------------ */

function restaurantEmail(b) {
  const when = `${longDate(b.date)} à ${b.time}`;
  const rows = [
    ["Date", capitalize(longDate(b.date))],
    ["Heure", b.time],
    ["Personnes", String(b.guests)],
    ["Nom", b.name],
    ["Téléphone", `<a href="tel:${escapeHtml(b.phone.replace(/[^\d+]/g, ""))}">${escapeHtml(b.phone)}</a>`, true],
    ["E-mail", b.email || "non communiqué"],
    ["Demande", b.notes || "aucune"]
  ];
  const htmlRows = rows.map(([label, value, raw]) =>
    `<tr><td style="padding:10px 16px 10px 0;color:#585D68;font-size:13px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">${label}</td>` +
    `<td style="padding:10px 0;font-size:16px;color:#0B0C0F">${raw ? value : escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
  ).join("");

  return {
    subject: `Réservation · ${capitalize(longDate(b.date))} · ${b.time} · ${guestsLabel(b.guests)}`,
    htmlContent: layout(
      "Nouvelle demande de réservation",
      `<p style="margin:0 0 20px;font-size:16px;color:#0B0C0F">${escapeHtml(capitalize(when))}, ${guestsLabel(b.guests)}.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${htmlRows}</table>
       <p style="margin:24px 0 0;font-size:15px;color:#585D68">Confirmez la réservation en appelant le client. Pour lui écrire, utilisez l’adresse générique du restaurant plutôt que votre adresse personnelle.</p>`,
      "E-mail envoyé par le formulaire de réservation du site."
    ),
    textContent: [
      "Nouvelle demande de réservation",
      "",
      ...rows.map(([label, value, raw]) => `${label} : ${raw ? b.phone : value}`),
      "",
      "Confirmez la réservation en appelant le client. Pour lui écrire, utilisez l’adresse générique du restaurant plutôt que votre adresse personnelle."
    ].join("\n")
  };
}

// Accusé de réception : uniquement des données validées (date, heure, nombre de personnes),
// jamais de texte libre saisi par le visiteur, pour qu'il ne puisse pas servir à envoyer du spam.
function clientEmail(b) {
  const when = `${capitalize(longDate(b.date))} à ${b.time}`;
  return {
    subject: `Votre demande de réservation · ${RESTAURANT.name}`,
    htmlContent: layout(
      "Demande bien reçue",
      `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#0B0C0F">Bonjour,</p>
       <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#0B0C0F">Nous avons bien reçu votre demande de réservation :</p>
       <p style="margin:0 0 16px;padding:16px 20px;background:#F6F6F4;font-size:18px;line-height:1.5;color:#0B0C0F"><strong>${escapeHtml(when)}</strong><br>${guestsLabel(b.guests)}</p>
       <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#0B0C0F">Elle n’est pas encore confirmée : nous vous recontactons rapidement pour la valider.</p>
       <p style="margin:0;font-size:16px;line-height:1.6;color:#0B0C0F">Un empêchement ou une question ? Appelez-nous au <a href="tel:${RESTAURANT.phoneIntl}" style="color:#1D3F95">${RESTAURANT.phone}</a>.</p>`,
      "Message automatique, merci de ne pas y répondre."
    ),
    textContent: [
      "Bonjour,",
      "",
      "Nous avons bien reçu votre demande de réservation :",
      `${when}, ${guestsLabel(b.guests)}.`,
      "",
      "Elle n’est pas encore confirmée : nous vous recontactons rapidement pour la valider.",
      `Un empêchement ou une question ? Appelez-nous au ${RESTAURANT.phone}.`,
      "",
      RESTAURANT.name,
      RESTAURANT.address,
      "",
      "Message automatique, merci de ne pas y répondre."
    ].join("\n")
  };
}

function layout(title, body, note) {
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#E9ECF0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E9ECF0;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;font-family:Helvetica,Arial,sans-serif">
<tr><td style="background:#0B0C0F;padding:22px 28px;color:#F6F6F4;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:.06em;text-transform:uppercase">${RESTAURANT.name}</td></tr>
<tr><td style="padding:32px 28px 8px"><h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;color:#0B0C0F">${title}</h1>${body}</td></tr>
<tr><td style="padding:24px 28px 28px;font-size:13px;line-height:1.6;color:#585D68">${RESTAURANT.name} · ${RESTAURANT.address}<br>${note}</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendEmail(env, message) {
  const res = await fetch(env.BREVO_API_URL || BREVO_URL, {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ ...message, tags: ["reservation"] })
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}

/* ------------------------------------------------------------------ */
/* Anti-robot                                                          */
/* ------------------------------------------------------------------ */

async function verifyTurnstile(secret, token, ip) {
  if (typeof token !== "string" || !token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_URL, { method: "POST", body });
    const out = await res.json();
    return out.success === true;
  } catch {
    return false;
  }
}

async function allowRequest(kv, ip) {
  const key = `reservation:${ip}:${Math.floor(Date.now() / 3600000)}`;
  const count = Number(await kv.get(key)) || 0;
  if (count >= RULES.perIpPerHour) return false;
  await kv.put(key, String(count + 1), { expirationTtl: 3700 });
  return true;
}

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function safeHost(url) {
  try { return new URL(url).host; } catch { return ""; }
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function isRealDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function weekday(iso) {
  return new Date(`${iso}T12:00:00Z`).getUTCDay();
}

function isoInZone(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function minutesInZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return get("hour") * 60 + get("minute");
}

function longDate(iso) {
  return new Intl.DateTimeFormat("fr-BE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(`${iso}T12:00:00Z`));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function guestsLabel(n) {
  return `${n} personne${n > 1 ? "s" : ""}`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
