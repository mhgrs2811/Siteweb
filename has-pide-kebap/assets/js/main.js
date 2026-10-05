/* Has Pide Kebap — interactions du site (sans dépendance) */
(function () {
  'use strict';

  var TEL_AFFICHE = '02 203 83 00';
  var TEL_LIEN = 'tel:+3222038300';
  var ADRESSE_CARTE = 'Has Pide Kebap, Chaussée de Haecht 115, 1030 Schaerbeek';

  // Horaires : index 0 = dimanche … 6 = samedi. null = fermé.
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
  function heureTexte(h) { return h + ' h'; }

  /* ---------- Heure de Bruxelles (indépendante du fuseau du visiteur) ---------- */
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

  /* ---------- En-tête ---------- */
  var header = $('[data-header]');
  function majHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
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
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) fermerNav(); });
  }

  /* ---------- Apparitions au défilement ---------- */
  $$('[data-reveal-group]').forEach(function (groupe) {
    $$('[data-reveal]', groupe).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.08) + 's'); });
  });
  var aReveler = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    aReveler.forEach(function (el) { revealObs.observe(el); });
  } else {
    aReveler.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Lien actif dans la navigation ---------- */
  var liensNav = $$('.nav-list a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window && liensNav.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        liensNav.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spyObs.observe(s); });
  }

  /* ---------- Statut ouvert / fermé + jour en cours ---------- */
  function prochaineOuverture(now) {
    for (var i = 0; i < 8; i++) {
      var j = (now.jour + i) % 7;
      var h = HORAIRES[j];
      if (!h) continue;
      if (i === 0 && now.minutes >= h[0] * 60) continue;
      var quand = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : JOURS[j];
      return 'ouvre ' + quand + ' à ' + heureTexte(h[0]);
    }
    return '';
  }

  function majStatut() {
    var now = maintenantBruxelles();
    var h = HORAIRES[now.jour];
    var ouvert = !!h && now.minutes >= h[0] * 60 && now.minutes < h[1] * 60;
    var texte;
    if (ouvert) {
      var reste = h[1] * 60 - now.minutes;
      texte = reste <= 60
        ? 'Ouvert · ferme bientôt (' + heureTexte(h[1]) + ')'
        : "Ouvert maintenant · jusqu'à " + heureTexte(h[1]);
    } else if (!h) {
      texte = "Fermé aujourd'hui · " + prochaineOuverture(now);
    } else {
      texte = 'Fermé · ' + prochaineOuverture(now);
    }
    $$('[data-open-status]').forEach(function (el) {
      el.setAttribute('data-state', ouvert ? 'open' : 'closed');
      var t = $('[data-open-text]', el);
      if (t) t.textContent = texte;
    });
    $$('.horaires tr[data-day]').forEach(function (tr) {
      tr.classList.toggle('is-today', +tr.getAttribute('data-day') === now.jour);
    });
  }
  majStatut();
  setInterval(majStatut, 60 * 1000);

  /* ---------- La carte : onglets ---------- */
  var menu = $('[data-tabs]');
  if (menu) {
    var onglets = $$('[role="tab"]', menu);
    var panneaux = $$('[role="tabpanel"]', menu);
    var barre = $('.menu-tabs', menu);
    var barreWrap = $('.menu-tabs-wrap', menu);

    var activer = function (onglet, opts) {
      opts = opts || {};
      onglets.forEach(function (o) {
        var actif = o === onglet;
        o.setAttribute('aria-selected', String(actif));
        o.tabIndex = actif ? 0 : -1;
      });
      panneaux.forEach(function (p) { p.hidden = p.id !== onglet.getAttribute('aria-controls'); });
      if (opts.focus) onglet.focus({ preventScroll: true });

      // Garde l'onglet visible dans la barre (mobile)
      var gauche = onglet.offsetLeft - barre.offsetLeft;
      var cible = gauche - (barre.clientWidth - onglet.offsetWidth) / 2;
      barre.scrollTo({ left: Math.max(0, cible), behavior: reduceMotion ? 'auto' : 'smooth' });

      // Si la barre est collée en haut, on remonte au début du panneau
      if (opts.recentrer) {
        var headerH = header ? header.offsetHeight : 0;
        var haut = barreWrap.getBoundingClientRect().top;
        if (haut <= headerH + 1) {
          var y = menu.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
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

  /* ---------- Carte Google Maps chargée au clic (RGPD) ---------- */
  var boutonCarte = $('[data-map-load]');
  if (boutonCarte) {
    boutonCarte.addEventListener('click', function () {
      var conteneur = $('[data-map]');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(ADRESSE_CARTE) + '&z=16&output=embed';
      iframe.title = 'Plan d’accès : ' + ADRESSE_CARTE;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      var placeholder = $('[data-map-placeholder]', conteneur);
      if (placeholder) placeholder.remove();
      conteneur.appendChild(iframe);
    });
  }

  /* ---------- Barre d'action mobile ---------- */
  var barreMobile = $('[data-mobile-bar]');
  var hero = $('[data-hero]');
  var reservation = $('#reserver');
  if (barreMobile && hero && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var resaVisible = false;
    var majBarre = function () { barreMobile.classList.toggle('is-visible', !heroVisible && !resaVisible); };
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting; majBarre();
    }, { rootMargin: '-30% 0px 0px 0px' }).observe(hero);
    if (reservation) {
      new IntersectionObserver(function (entries) {
        resaVisible = entries[0].isIntersecting; majBarre();
      }, { threshold: 0.25 }).observe(reservation);
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
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var j = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + j;
  }
  function dateDepuisIso(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  var now = maintenantBruxelles();
  champDate.min = now.iso;
  var max = new Date(now.date); max.setDate(max.getDate() + 90);
  champDate.max = isoDepuisDate(max);

  function marquer(champ, enErreur) {
    var field = champ.closest('.field');
    if (field) field.classList.toggle('has-error', enErreur);
    champ.setAttribute('aria-invalid', String(enErreur));
    var msg = form.querySelector('[data-error-for="' + (champ.id || champ.name) + '"]');
    if (msg) {
      msg.id = msg.id || 'err-' + (champ.id || champ.name);
      if (enErreur) champ.setAttribute('aria-describedby', msg.id);
      else champ.removeAttribute('aria-describedby');
    }
  }

  function majCreneaux() {
    var n = maintenantBruxelles();
    var estAujourdhui = champDate.value === n.iso;
    $$('option', champHeure).forEach(function (opt) {
      if (!opt.value) return;
      var hm = opt.value.split(':');
      var minutes = +hm[0] * 60 + +hm[1];
      opt.disabled = estAujourdhui && minutes < n.minutes + MARGE_MINUTES;
    });
    if (champHeure.selectedOptions[0] && champHeure.selectedOptions[0].disabled) champHeure.value = '';
  }

  function dateValide() {
    if (!champDate.value) return false;
    if (champDate.value < champDate.min || champDate.value > champDate.max) return false;
    return HORAIRES[dateDepuisIso(champDate.value).getDay()] !== null;
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
      if (champ.closest('.field.has-error')) marquer(champ, !champValide(champ));
    });
  });

  function champValide(champ) {
    if (champ === champDate) return dateValide();
    if (champ.type === 'checkbox') return !champ.required || champ.checked;
    if (champ.required && !champ.value.trim()) return false;
    if (champ.type === 'tel') return /^[0-9 +().\-/]{8,}$/.test(champ.value.trim());
    if (champ.type === 'email' && champ.value.trim()) return champ.checkValidity();
    if (champ.tagName === 'SELECT' && champ.required) return !!champ.value && !(champ.selectedOptions[0] || {}).disabled;
    return true;
  }

  function valider() {
    var champs = [$('#f-nom', form), $('#f-tel', form), $('#f-email', form), champDate, champHeure, champPersonnes, form.elements.consentement];
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
    var heure = donnees.get('heure').replace(':', ' h ').replace(/ h 00$/, ' h');
    return (prenom ? 'Merci ' + prenom + ' ! ' : '') +
      'Votre demande pour ' + pers + ', le ' + dateLongue + ' à ' + heure +
      ', est bien arrivée. Nous vous rappelons très vite pour confirmer votre table.';
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
        statut.innerHTML = 'Oups, l’envoi n’a pas fonctionné. Appelez-nous au <a href="' + TEL_LIEN + '">' +
          TEL_AFFICHE.replace(/ /g, ' ') + '</a>, on note votre table tout de suite.';
        statut.hidden = false;
      })
      .then(function () {
        bouton.disabled = false;
        libelleBouton.textContent = 'Envoyer ma demande';
      });
  });
})();
