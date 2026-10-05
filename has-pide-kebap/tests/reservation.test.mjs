// Tests de la fonction de réservation (sans réseau : l'envoi d'e-mails est simulé).
// Lancer : npm test
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, validate } from "../functions/api/reservation.js";

const OWNER = "proprietaire@exemple.be";
const env = {
  BREVO_API_KEY: "test-key",
  RESTAURANT_EMAIL: OWNER,
  SENDER_EMAIL: "reservations@exemple.be"
};

let sent;
beforeEach(() => {
  sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ messageId: "x" }), { status: 201 });
  };
});

// Une date bookable : dans deux jours, à 20:00
function futureDate(days = 2) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function booking(overrides = {}) {
  return {
    guests: 4, date: futureDate(), time: "20:00",
    name: "Sarah Dupont", phone: "0470 12 34 56", email: "sarah@exemple.be",
    notes: "Une chaise haute svp", consent: true, website: "", elapsed: 25000,
    ...overrides
  };
}

function post(body, headers = {}) {
  return new Request("https://haspidekebap.be/api/reservation", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://haspidekebap.be", "CF-Connecting-IP": "203.0.113.7", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
}

async function call(body, options = {}) {
  const res = await onRequestPost({ request: post(body, options.headers), env: options.env || env });
  return { status: res.status, json: await res.json() };
}

test("une demande valide part chez le restaurant et le client reçoit un accusé de réception", async () => {
  const { status, json } = await call(booking());
  assert.equal(status, 200);
  assert.deepEqual(json, { ok: true });
  assert.equal(sent.length, 2);

  const [toOwner, toClient] = sent.map((s) => s.body);
  assert.deepEqual(toOwner.to, [{ email: OWNER }]);
  assert.equal(toOwner.replyTo, undefined); // répondre dévoilerait l'adresse du propriétaire
  assert.match(toOwner.subject, /^Réservation · .+ · 20:00 · 4 personnes$/);
  assert.match(toOwner.textContent, /Téléphone : 0470 12 34 56/);
  assert.match(toOwner.textContent, /Une chaise haute svp/);

  assert.deepEqual(toClient.to, [{ email: "sarah@exemple.be" }]);
  assert.match(toClient.textContent, /pas encore confirmée/);
});

test("l'adresse du restaurant n'apparaît jamais dans ce que reçoit le client", async () => {
  const { json } = await call(booking());
  assert.equal(JSON.stringify(json).includes(OWNER), false);
  const toClient = JSON.stringify(sent[1].body);
  assert.equal(toClient.includes(OWNER), false);
});

test("l'accusé de réception ne reprend aucun texte libre saisi par le visiteur", async () => {
  await call(booking({ name: "Achetez maintenant", notes: "Promo incroyable" }));
  const toClient = JSON.stringify(sent[1].body);
  assert.equal(toClient.includes("Achetez"), false);
  assert.equal(toClient.includes("Promo"), false);
});

test("sans e-mail client, seul le restaurant est prévenu", async () => {
  const { status } = await call(booking({ email: "" }));
  assert.equal(status, 200);
  assert.equal(sent.length, 1);
});

test("champ piège rempli : réponse normale, rien n'est envoyé", async () => {
  const { status } = await call(booking({ website: "http://spam.example" }));
  assert.equal(status, 200);
  assert.equal(sent.length, 0);
});

test("formulaire rempli en moins de 3 secondes : rien n'est envoyé", async () => {
  const { status } = await call(booking({ elapsed: 800 }));
  assert.equal(status, 200);
  assert.equal(sent.length, 0);
});

test("les champs incohérents sont refusés avec la liste des erreurs", async () => {
  const { status, json } = await call(booking({ guests: 40, name: "x", phone: "123", email: "pas-un-email", consent: false }));
  assert.equal(status, 422);
  assert.deepEqual(json.fields.sort(), ["consent", "email", "guests", "name", "phone"]);
  assert.equal(sent.length, 0);
});

test("les liens sont refusés dans la demande particulière", async () => {
  const { status, json } = await call(booking({ notes: "Voir www.casino-en-ligne.example" }));
  assert.equal(status, 422);
  assert.deepEqual(json.fields, ["notes"]);
});

test("date passée, trop lointaine ou fausse : refusée", async () => {
  for (const date of [futureDate(-1), futureDate(90), "2026-02-30", "demain"]) {
    const { status, json } = await call(booking({ date }));
    assert.equal(status, 422, date);
    assert.deepEqual(json.fields, ["date"], date);
  }
});

test("créneau hors horaires ou hors grille : refusé", async () => {
  for (const time of ["10:30", "22:30", "20:15", "8pm"]) {
    const { status, json } = await call(booking({ time }));
    assert.equal(status, 422, time);
    assert.deepEqual(json.fields, ["time"], time);
  }
});

test("le jour même, il faut au moins 45 minutes d'avance", () => {
  // 18:10 à Bruxelles (16:10 UTC en été) : 18:30 est trop tôt, 19:00 passe
  const now = new Date("2026-07-15T16:10:00Z");
  assert.deepEqual(validate(booking({ date: "2026-07-15", time: "18:30" }), now).errors, ["time"]);
  assert.deepEqual(validate(booking({ date: "2026-07-15", time: "19:00" }), now).errors, []);
});

test("une requête venant d'un autre site est refusée", async () => {
  const { status } = await call(booking(), { headers: { origin: "https://autre-site.example" } });
  assert.equal(status, 403);
  assert.equal(sent.length, 0);
});

test("corps illisible : 400", async () => {
  const { status } = await call("pas du json");
  assert.equal(status, 400);
});

test("au-delà de 5 demandes par heure depuis la même adresse IP : 429", async () => {
  const store = new Map();
  const kv = { get: async (k) => store.get(k) ?? null, put: async (k, v) => { store.set(k, v); } };
  const withKv = { ...env, RATE_LIMIT: kv };
  for (let i = 0; i < 5; i++) {
    assert.equal((await call(booking(), { env: withKv })).status, 200);
  }
  assert.equal((await call(booking(), { env: withKv })).status, 429);
});

test("Turnstile activé : un jeton refusé bloque l'envoi", async () => {
  globalThis.fetch = async (url, init) => {
    if (String(url).includes("turnstile")) return new Response(JSON.stringify({ success: false }));
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response("{}", { status: 201 });
  };
  const { status, json } = await call(booking({ turnstile: "faux" }), { env: { ...env, TURNSTILE_SECRET: "s" } });
  assert.equal(status, 400);
  assert.equal(json.error, "captcha");
  assert.equal(sent.length, 0);
});

test("échec de l'envoi au restaurant : 502, le site propose d'appeler", async () => {
  globalThis.fetch = async () => new Response("quota", { status: 500 });
  const { status, json } = await call(booking());
  assert.equal(status, 502);
  assert.equal(json.error, "send_failed");
});

test("variables manquantes : 500 sans rien envoyer", async () => {
  const { status, json } = await call(booking(), { env: { BREVO_API_KEY: "k" } });
  assert.equal(status, 500);
  assert.equal(json.error, "not_configured");
  assert.equal(sent.length, 0);
});

test("le texte libre est échappé dans l'e-mail HTML du restaurant", async () => {
  await call(booking({ notes: "Table près de la <fenêtre> & au calme" }));
  assert.match(sent[0].body.htmlContent, /&lt;fenêtre&gt; &amp; au calme/);
});
