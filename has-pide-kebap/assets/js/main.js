/* Has Pide Kebap — interactions du site (sans dépendance) */
(function () {
  'use strict';

  var TEL_AFFICHE = '02 203 83 00';
  var TEL_LIEN = 'tel:+3222038300';
  var ADRESSE_CARTE = 'Has Pide Kebap, Chaussée de Haecht 115, 1030 Schaerbeek';

  // Horaires : index 0 = dimanche … 6 = samedi. null = fermé.
  // À garder synchronisé avec le tableau .horaires et le JSON-LD de index.html.
  var HORAIRES = {
    0: [11, 23],
    1: [11, 23],
    2: [11, 23],
    3: [11, 23],
    4: null,
    5: [11, 23],
    6: [11, 23]
  };
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function h(n) { return n + ' h'; }

  /* ---------- Heure de Bruxelles, quel que soit le fuseau du visiteur ---------- */
  function maintenantBruxelles() {
    var parts = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Brussels',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var y = +parts.year, m = +parts.month, d = +parts.day;
    return {
      iso: parts.year + '-' + parts.month + '-' + parts.day,
      jour: new Date(y, m - 1, d).getDay(),
      minutes: (+parts.hour % 24) * 60 + +parts.minute,
      date: new Date(y, m - 1, d)
    };
  }

  /* ==========================================================================
     Carreaux d'İznik : motif étoile-et-croix dessiné au canvas.
     Les étoiles à huit branches se touchent pointe contre pointe ; l'espace
     laissé entre elles forme les croix. Chaque étoile varie un peu de teinte,
     comme un émail posé à la main.
     ========================================================================== */
  var PALETTES = {
    facade:    { etoile: '#1f3f9a', croix: '#2a9a98', joint: '#0a0d10', motif: '#eef2f0', coeur: '#3fb8b5', cellule: function (w) { return Math.max(58, Math.min(92, w / 6.2)); } },
    frise:     { etoile: '#1f3f9a', croix: '#2a9a98', joint: '#0a0d10', motif: '#eef2f0', coeur: '#3fb8b5', cellule: function (w, hh) { return hh; } },
    plan:      { etoile: '#1f3f9a', croix: '#2a9a98', joint: '#0a0d10', motif: '#eef2f0', coeur: '#3fb8b5', cellule: function () { return 64; } },
    signature: { etoile: '#eef2f0', croix: '#3fb8b5', joint: '#1f3f9a', motif: '#1f3f9a', coeur: '#1f3f9a', cellule: function (w) { return w; } }
  };

  function alea(i, j) {
    var x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function nuance(hex, t) {
    var n = parseInt(hex.slice(1), 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      return Math.round(t >= 0 ? v + (255 - v) * t : v * (1 + t));
    });
    return 'rgb(' + c.join(',') + ')';
  }
  function cheminEtoile(ctx, cx, cy, R) {
    var r = R * 0.7654;
    ctx.beginPath();
    for (var k = 0; k < 16; k++) {
      var a = -Math.PI / 2 + k * Math.PI / 8;
      var rad = k % 2 ? r : R;
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.closePath();
  }

  function dessinerCarreaux(canvas, progression) {
    var pal = PALETTES[canvas.getAttribute('data-carreaux')] || PALETTES.facade;
    var w = canvas.clientWidth, hh = canvas.clientHeight;
    if (!w || !hh) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(hh * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hh * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var s = pal.cellule(w, hh);
    var R = s / 2;
    var joint = Math.max(1.5, s * 0.035);
    var ox = (w / 2) % s, oy = (hh / 2) % s;
    var cols = Math.ceil(w / s) + 2, rows = Math.ceil(hh / s) + 2;
    var diag = cols + rows;

    ctx.fillStyle = pal.croix;
    ctx.fillRect(0, 0, w, hh);

    for (var j = -1; j < rows; j++) {
      for (var i = -1; i < cols; i++) {
        var cx = ox + i * s, cy = oy + j * s;
        var p = progression ? progression((i + j + 2) / diag) : 1;

        // Petit losange au cœur de chaque croix
        var dx = cx + s / 2, dy = cy + s / 2, q = s * 0.07;
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = pal.motif;
        ctx.beginPath();
        ctx.moveTo(dx, dy - q); ctx.lineTo(dx + q, dy); ctx.lineTo(dx, dy + q); ctx.lineTo(dx - q, dy);
        ctx.closePath();
        ctx.fill();

        if (p <= 0) continue;
        ctx.globalAlpha = p;
        var Rp = R * (0.94 + 0.06 * p);

        // Émail de l'étoile, légèrement irrégulier
        cheminEtoile(ctx, cx, cy, Rp);
        ctx.fillStyle = nuance(pal.etoile, (alea(i, j) - 0.5) * 0.16);
        ctx.fill();
        ctx.lineWidth = joint;
        ctx.strokeStyle = pal.joint;
        ctx.stroke();

        // Reflet de glaçure
        ctx.save();
        cheminEtoile(ctx, cx, cy, Rp);
        ctx.clip();
        var g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
        g.addColorStop(0, 'rgba(255,255,255,0.16)');
        g.addColorStop(0.5, 'rgba(255,255,255,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.16)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - R, cy - R, s, s);
        ctx.restore();

        // Rosace à huit pétales
        ctx.globalAlpha = p * 0.9;
        ctx.fillStyle = pal.motif;
        for (var k = 0; k < 8; k++) {
          var ang = k * Math.PI / 4 - Math.PI / 2;
          var L = (k % 2 ? 0.4 : 0.5) * R;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(ang) * L / 2, cy + Math.sin(ang) * L / 2, L / 2, L * 0.17, ang, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = p;
        ctx.fillStyle = pal.coeur;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.13, 0, Math.PI * 2);
        ctx.fill();

        // Filet intérieur
        ctx.globalAlpha = p * 0.35;
        cheminEtoile(ctx, cx, cy, Rp * 0.82);
        ctx.lineWidth = 1;
        ctx.strokeStyle = pal.motif;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  var carreaux = $$('canvas[data-carreaux]');
  carreaux.forEach(function (canvas) {
    var anime = canvas.hasAttribute('data-anim') && !reduceMotion;
    if (anime) {
      // Un seul moment animé sur la page : les carreaux de la façade se posent en diagonale.
      var debut = null, DUREE = 1300, ETOILE = 420;
      var pas = function (t) {
        if (debut === null) debut = t;
        var e = t - debut;
        dessinerCarreaux(canvas, function (rang) {
          return Math.max(0, Math.min(1, (e - rang * (DUREE - ETOILE)) / ETOILE));
        });
        if (e < DUREE + 50) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    } else {
      dessinerCarreaux(canvas);
    }
  });
  if ('ResizeObserver' in window) {
    var enAttente = false;
    var ro = new ResizeObserver(function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(function () {
        enAttente = false;
        carreaux.forEach(function (c) { dessinerCarreaux(c); });
      });
    });
    carreaux.forEach(function (c) { ro.observe(c); });
  }

  /* ---------- En-tête ---------- */
  var header = $('[data-header]');
  function majHeader() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); }
  majHeader();
  window.addEventListener('scroll', majHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = $('[data-nav-toggle]');
  function fermerNav() {
    root.classList.remove('nav-open');
    document.body.style.overflow = '';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var ouvert = root.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(ouvert));
      document.body.style.overflow = ouvert ? 'hidden' : '';
    });
    $$('#nav-list a').forEach(function (a) { a.addEventListener('click', fermerNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('nav-open')) { fermerNav(); toggle.focus(); }
    });
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (e) { if (e.matches) fermerNav(); });
  }

  /* ---------- Lien actif dans la navigation ---------- */
  var liensNav = $$('.nav-list a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window && liensNav.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        liensNav.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Ouvert / fermé ---------- */
  function prochaineOuverture(now) {
    for (var i = 0; i < 8; i++) {
      var j = (now.jour + i) % 7;
      var hj = HORAIRES[j];
      if (!hj) continue;
      if (i === 0 && now.minutes >= hj[0] * 60) continue;
      var quand = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : JOURS[j];
      return 'réouverture ' + quand + ' à ' + h(hj[0]);
    }
    return '';
  }

  function majStatut() {
    var now = maintenantBruxelles();
    var hj = HORAIRES[now.jour];
    var ouvert = !!hj && now.minutes >= hj[0] * 60 && now.minutes < hj[1] * 60;
    var detail;
    if (ouvert) {
      detail = (hj[1] * 60 - now.minutes <= 60 ? 'Ouvert, fermeture à ' : "Ouvert jusqu'à ") + h(hj[1]);
    } else {
      var suite = prochaineOuverture(now);
      detail = (hj ? 'Fermé, ' : "Fermé aujourd'hui, ") + suite;
    }
    $$('[data-statut-court]').forEach(function (el) { el.textContent = detail; });
    var pancarte = $('[data-pancarte]');
    if (pancarte) {
      pancarte.setAttribute('data-state', ouvert ? 'open' : 'closed');
      $('[data-pancarte-mot]', pancarte).textContent = ouvert ? 'AÇIK' : 'KAPALI';
      $('[data-pancarte-detail]', pancarte).textContent = detail;
    }
    $$('.horaires tr[data-day]').forEach(function (tr) {
      tr.classList.toggle('aujourdhui', +tr.getAttribute('data-day') === now.jour);
    });
  }
  majStatut();
  setInterval(majStatut, 60 * 1000);

  /* ---------- La carte : onglets ---------- */
  var menu = $('[data-tabs]');
  if (menu) {
    var onglets = $$('[role="tab"]', menu);
    var panneaux = $$('[role="tabpanel"]', menu);
    var barre = $('.onglets', menu);
    var barreWrap = $('.onglets-barre', menu);

    var activer = function (onglet, opts) {
      opts = opts || {};
      onglets.forEach(function (o) {
        var actif = o === onglet;
        o.setAttribute('aria-selected', String(actif));
        o.tabIndex = actif ? 0 : -1;
      });
      panneaux.forEach(function (p) { p.hidden = p.id !== onglet.getAttribute('aria-controls'); });
      if (opts.focus) onglet.focus({ preventScroll: true });

      var cible = onglet.offsetLeft - barre.offsetLeft - (barre.clientWidth - onglet.offsetWidth) / 2;
      barre.scrollTo({ left: Math.max(0, cible), behavior: reduceMotion ? 'auto' : 'smooth' });

      // Si la barre est collée en haut, on remonte au début du panneau
      if (opts.recentrer) {
        var headerH = header ? header.offsetHeight : 0;
        if (barreWrap.getBoundingClientRect().top <= headerH + 1) {
          var y = barreWrap.parentNode.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
      // Le canvas du plat signature peut devenir visible : on le redessine à sa taille.
      $$('canvas[data-carreaux]', menu).forEach(function (c) { dessinerCarreaux(c); });
    };

    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { activer(o, { recentrer: true }); });
      o.addEventListener('keydown', function (e) {
        var cible = null;
        if (e.key === 'ArrowRight') cible = onglets[(i + 1) % onglets.length];
        else if (e.key === 'ArrowLeft') cible = onglets[(i - 1 + onglets.length) % onglets.length];
        else if (e.key === 'Home') cible = onglets[0];
        else if (e.key === 'End') cible = onglets[onglets.length - 1];
        if (cible) { e.preventDefault(); activer(cible, { focus: true }); }
      });
    });
    activer(onglets[0]);
  }

  /* ---------- Plan Google Maps, chargé seulement au clic (RGPD) ---------- */
  var boutonPlan = $('[data-plan-charger]');
  if (boutonPlan) {
    boutonPlan.addEventListener('click', function () {
      var plan = $('[data-plan]');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(ADRESSE_CARTE) + '&z=16&output=embed';
      iframe.title = 'Plan d’accès : ' + ADRESSE_CARTE;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      $$('canvas, [data-plan-cta]', plan).forEach(function (el) { el.remove(); });
      plan.appendChild(iframe);
    });
  }

  /* ---------- Barre d'action mobile ---------- */
  var barreMobile = $('[data-barre-mobile]');
  var hero = $('[data-hero]');
  var reservation = $('#reserver');
  if (barreMobile && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, resaVisible = false;
    var majBarre = function () { barreMobile.classList.toggle('is-visible', !heroVisible && !resaVisible); };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; majBarre(); }, { rootMargin: '-30% 0px 0px 0px' }).observe(hero);
    if (reservation) {
      new IntersectionObserver(function (e) { resaVisible = e[0].isIntersecting; majBarre(); }, { threshold: 0.25 }).observe(reservation);
    }
  }

  /* ---------- Formulaire de réservation ---------- */
  var form = $('[data-reservation-form]');
  if (!form) return;

  var champDate = $('#f-date', form);
  var champHeure = $('#f-heure', form);
  var champPersonnes = $('#f-personnes', form);
  var aideGroupe = $('[data-groupe-hint]', form);
  var statut = $('[data-form-status]', form);
  var bouton = $('[data-submit]', form);
  var libelleBouton = $('[data-submit-label]', form);
  var succes = $('[data-form-success]');
  var MARGE_MINUTES = 45; // délai minimum entre la demande et l'heure réservée

  function isoDepuisDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dateDepuisIso(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  var maintenant = maintenantBruxelles();
  champDate.min = maintenant.iso;
  var max = new Date(maintenant.date);
  max.setDate(max.getDate() + 90);
  champDate.max = isoDepuisDate(max);

  function marquer(champ, enErreur) {
    var bloc = champ.closest('.champ');
    if (bloc) bloc.classList.toggle('has-error', enErreur);
    champ.setAttribute('aria-invalid', String(enErreur));
    var msg = form.querySelector('[data-error-for="' + champ.id + '"]');
    if (msg) {
      msg.id = msg.id || 'err-' + champ.id;
      if (enErreur) champ.setAttribute('aria-describedby', msg.id);
      else champ.removeAttribute('aria-describedby');
    }
  }

  function majCreneaux() {
    var n = maintenantBruxelles();
    var aujourdhui = champDate.value === n.iso;
    $$('option', champHeure).forEach(function (opt) {
      if (!opt.value) return;
      var hm = opt.value.split(':');
      opt.disabled = aujourdhui && +hm[0] * 60 + +hm[1] < n.minutes + MARGE_MINUTES;
    });
    if (champHeure.selectedOptions[0] && champHeure.selectedOptions[0].disabled) champHeure.value = '';
  }

  function dateValide() {
    if (!champDate.value) return false;
    if (champDate.value < champDate.min || champDate.value > champDate.max) return false;
    return HORAIRES[dateDepuisIso(champDate.value).getDay()] !== null;
  }

  function champValide(champ) {
    if (champ === champDate) return dateValide();
    if (champ.type === 'checkbox') return !champ.required || champ.checked;
    if (champ.required && !champ.value.trim()) return false;
    if (champ.type === 'tel') return /^[0-9 +().\-/]{8,}$/.test(champ.value.trim());
    if (champ.type === 'email' && champ.value.trim()) return champ.checkValidity();
    if (champ.tagName === 'SELECT' && champ.required) return !!champ.value && !(champ.selectedOptions[0] || {}).disabled;
    return true;
  }

  champDate.addEventListener('change', function () {
    majCreneaux();
    if (champDate.value) marquer(champDate, !dateValide());
  });
  champPersonnes.addEventListener('change', function () {
    aideGroupe.hidden = champPersonnes.value !== '10+';
  });
  $$('input, select, textarea', form).forEach(function (champ) {
    var evt = champ.type === 'checkbox' || champ.tagName === 'SELECT' ? 'change' : 'input';
    champ.addEventListener(evt, function () {
      if (champ.closest('.champ.has-error')) marquer(champ, !champValide(champ));
    });
  });

  function valider() {
    var champs = [$('#f-nom', form), $('#f-tel', form), $('#f-email', form), champDate, champHeure, champPersonnes, $('#f-consentement', form)];
    var premier = null;
    champs.forEach(function (champ) {
      var ok = champValide(champ);
      marquer(champ, !ok);
      if (!ok && !premier) premier = champ;
    });
    if (premier) premier.focus();
    return !premier;
  }

  function messageSucces(donnees) {
    var prenom = (donnees.get('nom') || '').trim().split(/\s+/)[0];
    var n = donnees.get('personnes');
    var pers = n === '10+' ? 'plus de 10 personnes' : n + (n === '1' ? ' personne' : ' personnes');
    var dateLongue = new Intl.DateTimeFormat('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })
      .format(dateDepuisIso(donnees.get('date')));
    var hm = donnees.get('heure').split(':');
    var heure = +hm[0] + ' h' + (hm[1] !== '00' ? ' ' + hm[1] : '');
    return (prenom ? 'Merci ' + prenom + '. ' : '') +
      'Votre demande pour ' + pers + ', le ' + dateLongue + ' à ' + heure +
      ', est bien arrivée. Nous vous rappelons pour confirmer votre table.';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statut.hidden = true;
    if (form.elements['bot-field'] && form.elements['bot-field'].value) return;
    if (!valider()) return;

    var donnees = new FormData(form);
    bouton.disabled = true;
    libelleBouton.textContent = 'Envoi en cours…';

    // Par défaut : Netlify Forms. Pour un autre service (Formspree…), renseigner data-endpoint sur le <form>.
    var endpoint = form.getAttribute('data-endpoint') || '/';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams(donnees).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        $('[data-success-text]', succes).textContent = messageSucces(donnees);
        form.hidden = true;
        succes.hidden = false;
        succes.focus();
      })
      .catch(function () {
        statut.innerHTML = 'La demande n’est pas partie. Appelez-nous au <a href="' + TEL_LIEN + '">' +
          TEL_AFFICHE + '</a> et on note votre table directement.';
        statut.hidden = false;
      })
      .then(function () {
        bouton.disabled = false;
        libelleBouton.textContent = 'Envoyer ma demande';
      });
  });
})();
