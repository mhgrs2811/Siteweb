/* ═══════════════════════════════════════════════════════════
   HAS PIDE KEBAP — réservation de table
   Module autonome, chargé APRÈS app.js. Réglages et textes dans
   window.SITE_CONTENT.reservation (content.js).
   Ouvert par tout lien vers #reserver : CTA du header, CTA du
   processus, bouton ajouté au footer, ou lien direct …/#reserver.
   ═══════════════════════════════════════════════════════════ */
(() => {
  const C = window.SITE_CONTENT || {};
  const R = C.reservation;
  if (!R) return;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const HASH = '#reserver';

  /* ─── créneaux ─── */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const SLOTS = [];
  for (let t = toMin(R.firstSlot); t <= toMin(R.lastSlot); t += R.stepMinutes) SLOTS.push(t);
  const fmtSlot = (t) => `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
  const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayLabel = new Intl.DateTimeFormat('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });

  // le jour même, on ne propose que les créneaux à plus de 30 min
  function slotsFor(iso) {
    const now = new Date();
    if (iso !== isoDay(now)) return SLOTS;
    const limit = now.getHours() * 60 + now.getMinutes() + 30;
    return SLOTS.filter((t) => t >= limit);
  }

  function openDays() {
    const out = [], d = new Date();
    d.setHours(12, 0, 0, 0);
    for (let i = 0; i <= R.daysAhead; i++, d.setDate(d.getDate() + 1)) {
      if (R.closedDays.includes(d.getDay())) continue;
      const iso = isoDay(d);
      if (!slotsFor(iso).length) continue;
      const label = dayLabel.format(d);
      out.push({ iso, label: i === 0 ? `Aujourd’hui — ${label}` : i === 1 ? `Demain — ${label}` : label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return out;
  }

  /* ─── panneau ─── */
  const guests = Array.from({ length: R.maxGuests }, (_, i) => i + 1)
    .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n > 1 ? 'personnes' : 'personne'}</option>`).join('');

  const root = document.createElement('div');
  root.className = 'resa';
  root.id = 'resa';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="resa-backdrop" data-close></div>
    <div class="resa-panel" role="dialog" aria-modal="true" aria-labelledby="resaTitle">
      <div class="resa-head">
        <p class="mono ash">${esc(C.brand.name)}</p>
        <button type="button" class="resa-close mono" data-close>Fermer ✕</button>
      </div>
      <h2 class="resa-title" id="resaTitle">${esc(R.title)}</h2>
      <p class="resa-intro">${esc(R.intro)}</p>

      <form class="resa-form" id="resaForm" novalidate>
        <div class="resa-row resa-row-date">
          <label class="resa-field"><span class="mono ash">Date</span>
            <select id="resaDate" name="date" required></select></label>
          <label class="resa-field"><span class="mono ash">Heure</span>
            <select id="resaTime" name="time" required></select></label>
        </div>
        <div class="resa-row">
          <label class="resa-field"><span class="mono ash">Couverts</span>
            <select id="resaGuests" name="guests">${guests}</select></label>
          <label class="resa-field"><span class="mono ash">Placement</span>
            <select id="resaSeat" name="seat">
              <option value="Peu importe">Peu importe</option>
              <option value="En salle">En salle</option>
              <option value="En terrasse">En terrasse</option>
            </select></label>
        </div>
        <label class="resa-field"><span class="mono ash">Nom</span>
          <input id="resaName" name="name" type="text" autocomplete="name" required></label>
        <label class="resa-field"><span class="mono ash">Téléphone</span>
          <input id="resaPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
        <label class="resa-field"><span class="mono ash">E-mail (facultatif)</span>
          <input id="resaEmail" name="email" type="email" autocomplete="email"></label>
        <label class="resa-field"><span class="mono ash">Message (facultatif)</span>
          <textarea id="resaMsg" name="message" rows="2" placeholder="Menu enfant, chaise haute, allergie…"></textarea></label>
        <input class="resa-hp" type="checkbox" name="botcheck" id="resaBot" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="resa-error" id="resaError" role="alert"></p>
        <button type="submit" class="resa-submit mono" id="resaSubmit">Envoyer la demande</button>
        <p class="resa-note mono ash">${esc(R.note)}</p>
      </form>

      <div class="resa-done" id="resaDone">
        <p class="mono ash" id="resaDoneKicker"></p>
        <h3 class="resa-title" id="resaDoneTitle"></h3>
        <p class="resa-intro" id="resaDoneText"></p>
        <button type="button" class="resa-submit mono" data-close>Fermer</button>
      </div>
    </div>`;
  document.body.appendChild(root);

  const form = $('#resaForm', root), dateSel = $('#resaDate', root), timeSel = $('#resaTime', root);
  const errorEl = $('#resaError', root), submitBtn = $('#resaSubmit', root), panel = $('.resa-panel', root);

  function fillDates() {
    const keep = dateSel.value;
    dateSel.innerHTML = openDays().map((d) => `<option value="${d.iso}">${esc(d.label)}</option>`).join('');
    if (keep && $(`option[value="${keep}"]`, dateSel)) dateSel.value = keep;
    fillTimes();
  }
  function fillTimes() {
    const keep = timeSel.value;
    timeSel.innerHTML = slotsFor(dateSel.value).map((t) => `<option value="${fmtSlot(t)}">${fmtSlot(t).replace(':', ' h ')}</option>`).join('');
    if (keep && $(`option[value="${keep}"]`, timeSel)) timeSel.value = keep;
  }
  dateSel.addEventListener('change', fillTimes);

  /* ─── ouverture / fermeture ─── */
  let lastFocus = null;
  function open() {
    if (root.classList.contains('is-open')) return;
    lastFocus = document.activeElement;
    fillDates();
    form.hidden = false;
    panel.classList.remove('is-done');
    $('#resaDone', root).classList.remove('is-shown');
    errorEl.textContent = '';
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('resa-lock');
    setTimeout(() => dateSel.focus({ preventScroll: true }), 60);
  }
  function close() {
    if (!root.classList.contains('is-open')) return;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('resa-lock');
    if (location.hash === HASH) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-close]', root).forEach((el) => el.addEventListener('click', close));
  addEventListener('keydown', (e) => {
    if (!root.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    // focus gardé dans le panneau
    const f = $$('button, select, input:not(.resa-hp), textarea', panel).filter((el) => el.offsetParent);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ─── déclencheurs ─── */
  // CTA du header et du processus : app.js les fait défiler vers #contact ;
  // pointés sur #reserver (aucun élément de ce nom), app.js les laisse passer.
  const triggers = [$('.dock-cta'), $('#stepsCtaLink')].filter(Boolean);
  const reass = $('.footer-reassurance');
  if (reass && R.footerCta) {
    const btn = document.createElement('a');
    btn.className = 'footer-resa mono';
    btn.textContent = R.footerCta;
    reass.insertAdjacentElement('afterend', btn);
    triggers.push(btn);
  }
  triggers.forEach((a) => {
    a.setAttribute('href', HASH);
    a.addEventListener('click', (e) => { e.preventDefault(); open(); });
  });
  addEventListener('hashchange', () => { if (location.hash === HASH) open(); });
  if (location.hash === HASH) setTimeout(open, 1200);   // lien direct : après le loader

  /* ─── envoi ─── */
  function fail(msg, el) {
    errorEl.textContent = msg;
    if (el) el.focus();
    return false;
  }
  function validate() {
    const name = $('#resaName', root), phone = $('#resaPhone', root), email = $('#resaEmail', root);
    if (!dateSel.value || !timeSel.value) return fail('Choisissez une date et une heure.', dateSel);
    if (name.value.trim().length < 2) return fail('Indiquez le nom de la réservation.', name);
    if (phone.value.replace(/\D/g, '').length < 9) return fail('Indiquez un numéro de téléphone complet, pour que le restaurant puisse vous rappeler.', phone);
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return fail('Cette adresse e-mail semble incomplète.', email);
    errorEl.textContent = '';
    return true;
  }

  function summary() {
    const v = (id) => $(id, root).value.trim();
    const dateTxt = (dateSel.selectedOptions[0] ? dateSel.selectedOptions[0].textContent.replace(/^(Aujourd’hui|Demain) — /, '') : v('#resaDate')).toLowerCase();
    return {
      Date: dateTxt,
      Heure: timeSel.selectedOptions[0] ? timeSel.selectedOptions[0].textContent : v('#resaTime'),
      Couverts: v('#resaGuests'),
      Placement: v('#resaSeat'),
      Nom: v('#resaName'),
      'Téléphone': v('#resaPhone'),
      'E-mail': v('#resaEmail') || '—',
      Message: v('#resaMsg') || '—'
    };
  }

  function done(kicker, title, text) {
    $('#resaDoneKicker', root).textContent = kicker;
    $('#resaDoneTitle', root).textContent = title;
    $('#resaDoneText', root).textContent = text;
    form.hidden = true;
    panel.classList.add('is-done');
    const d = $('#resaDone', root);
    d.classList.add('is-shown');
    $('button', d).focus({ preventScroll: true });
    form.reset();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if ($('#resaBot', root).checked) return;          // robot (case invisible cochée)
    if (!validate()) return;
    const s = summary();
    const subject = `Réservation — ${s.Date}, ${s.Heure}, ${s.Couverts} pers. — ${s.Nom}`;

    // sans clé Web3Forms : l'application e-mail du client s'ouvre, demande pré-remplie
    if (!R.accessKey) {
      const body = Object.entries(s).map(([k, val]) => `${k} : ${val}`).join('\n');
      location.href = `mailto:${R.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      done('DERNIÈRE ÉTAPE', 'Envoyez l’e-mail.', 'Votre application e-mail s’est ouverte avec la demande déjà rédigée : envoyez-la pour la transmettre au restaurant. Rien ne s’est ouvert ? Appelez le ' + (C.contact.phone || R.email) + '.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: R.accessKey,
          subject,
          from_name: `${C.brand.name} — site web`,
          ...(s['E-mail'] !== '—' ? { replyto: s['E-mail'] } : {}),
          ...s
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.status);
      done('DEMANDE ENVOYÉE', 'Merci, ' + s.Nom.split(' ')[0] + '.', `Votre demande pour ${s.Couverts} ${+s.Couverts > 1 ? 'personnes' : 'personne'}, ${s.Date} à ${s.Heure}, est bien partie. Le restaurant vous rappelle au ${s['Téléphone']} pour confirmer la table.`);
    } catch (err) {
      fail('La demande n’a pas pu partir. Réessayez dans un instant, ou appelez le ' + (C.contact.phone || '') + '.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer la demande';
    }
  });
})();
