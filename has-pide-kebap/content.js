/* ═══════════════════════════════════════════════════════════
   TEMPLATE « SITE IMMERSIF » — content.js
   ► L'UNIQUE FICHIER À RÉÉCRIRE pour produire un nouveau site.
   Renommer en content.js dans le projet cible. La partie
   « injection » en bas de fichier est le moteur de remplissage :
   la copier TELLE QUELLE, ne réécrire que window.SITE_CONTENT.

   Schéma narratif (rôle de conversion de chaque bloc) :
   1. ACCROCHE       — hook : promesse + identité en 3 secondes
   2. POSITIONNEMENT — positioning : ce que je fais, pour qui, où
   3. DÉMARCHE       — manifesto : pourquoi moi (différenciation)
   4. PREUVE         — proof : réalisations (masonry) OU features (bento)
   5. DEVISE         — motto : 3 mots-clés géants + légendes
   6-7. PROCESSUS    — universes : « X en 3 étapes » + visuels posés
   8. PREUVE SOCIALE — testimonial : un client parle
   9. OBJECTIONS     — objections : « Pas de… Juste… »
   10. CONVERSION    — contact : e-mail + réassurance
   ═══════════════════════════════════════════════════════════ */

window.SITE_CONTENT = {

  brand: {
    name: 'HAS PIDE KEBAP',                         // wordmark (header, loader, footer géant)
    title: 'HAS PIDE KEBAP — Pide, kebab & lahmacun, street-food turque',
    description: 'HAS PIDE KEBAP : pide, kebab, lahmacun et assiettes turques servis vite, généreux et brûlants — sur place, à emporter ou en livraison.',
    kicker: 'HAS PIDE KEBAP — STREET-FOOD TURQUE',
    copyright: '© 2026 — HAS PIDE KEBAP',
    signature: 'AFIYET OLSUN — BON APPÉTIT',
    socials: [
      { label: 'INSTAGRAM ↗', url: 'https://www.instagram.com/haspidekebap' },
      { label: 'TIKTOK ↗', url: 'https://www.tiktok.com/@haspidekebap' }
    ]
  },

  nav: { proof: 'CARTE', universes: 'SERVICE', cta: 'COMMANDER' },

  hook: {
    line1: 'Pide et kebab généreux,',
    line2a: 'servis',
    line2b: 'brûlants.',
    image: 'images/hero.jpg',
    imageAlt: 'Kebab fraîchement tranché à la broche, servi brûlant',
    floaters: [
      'images/fl-01.jpg',
      'images/fl-02.jpg',
      'images/fl-03.jpg',
      'images/fl-04.jpg',
      'images/fl-05.jpg',
      'images/fl-06.jpg',
      'images/fl-07.jpg',
      'images/fl-08.jpg',
      'images/fl-09.jpg',
      'images/fl-10.jpg'
    ]
  },

  positioning: 'Street-food turque — sur place ou livrée.',

  manifesto: {
    text: 'En turc, has veut dire vrai. Ici, rien ne tiédit sous une lampe : la viande est tranchée à la broche, le pide sort du four à la commande, et tout part [[encore brûlant]] — en quelques minutes.'
  },

  proof: {
    layout: 'masonry',
    kicker: 'LA CARTE',
    title: 'Ce qui sort du four',
    sub: 'Pide, kebab, lahmacun et assiettes — préparés devant vous, servis en quelques minutes.',
    meta: 'HUIT INCONTOURNABLES — DU MIDI À TARD',
    projects: [
      { img: 'images/carte-1.jpg', title: 'Pide au fromage', meta: 'CUIT AU FOUR — FROMAGE FONDU' },
      { img: 'images/carte-2.jpg', title: 'Dürüm kebab', meta: 'GALETTE ROULÉE — SAUCE BLANCHE' },
      { img: 'images/carte-3.jpg', title: 'Lahmacun', meta: 'PÂTE FINE — VIANDE ÉPICÉE' },
      { img: 'images/carte-4.jpg', title: 'Assiette kebab', meta: 'RIZ — SALADE — FRITES' },
      { img: 'images/carte-5.jpg', title: 'Pide viande hachée', meta: 'CUIT AU FOUR — BŒUF ÉPICÉ' },
      { img: 'images/carte-6.jpg', title: 'Brochettes grillées', meta: 'GRILL — LÉGUMES RÔTIS' },
      { img: 'images/carte-7.jpg', title: 'Kebab sandwich', meta: 'PAIN MAISON — CRUDITÉS' },
      { img: 'images/carte-8.jpg', title: 'Baklava & thé', meta: 'DESSERT — THÉ TURC' }
    ]
  },

  motto: {
    kicker: 'CE QUI PASSE AVANT TOUT',
    words: [
      { word: 'Chaud', hint: 'Rien n’attend sous une lampe : tout part à la commande.' },
      { word: 'Vite', hint: 'Commandé, préparé, servi — quelques minutes, pas plus.' },
      { word: 'Généreux', hint: 'Des assiettes pleines, pour repartir calé.' }
    ]
  },

  universes: {
    introA: 'Une',
    introB: 'faim,',
    introC: '3 étapes.',
    cta: 'Commander →',
    image: 'images/process.jpg',
    items: [
      { name: 'Choisir', meta: 'ÉTAPE — 01', desc: 'Pide, kebab, lahmacun ou assiette : au comptoir, par téléphone ou en livraison.' },
      { name: 'Cuisiner', meta: 'ÉTAPE — 02', desc: 'La viande est tranchée à la broche, le pide passe au four. Rien n’est préparé à l’avance.' },
      { name: 'Servir', meta: 'ÉTAPE — 03', desc: 'Sur place, à emporter ou livré chez vous — chaud, en quelques minutes.' }
    ]
  },

  testimonial: {
    kicker: 'SUR PLACE, À L’HEURE DU DÉJEUNER',
    figure: '7',
    unit: 'min',
    quote: 'Je viens deux fois par semaine entre midi et deux. Je commande, je m’assois, et mon pide arrive encore brûlant avant que j’aie fini mon ayran.',
    author: 'KARIM B. — CLIENT HABITUÉ'
  },

  objections: {
    items: ['Pas d’attente.', 'Pas de tiède.', 'Pas de chichis.'],
    finale: 'Juste du kebab,',
    pill: 'bien fait.'
  },

  contact: {
    kicker: 'UNE COMMANDE DE GROUPE, UNE QUESTION ?',
    email: 'haspide2026@gmail.com',
    reassurance: 'SUR PLACE — À EMPORTER — EN LIVRAISON'
  },

  trail: [
    'images/trail-01.jpg', 'images/trail-02.jpg',
    'images/trail-03.jpg', 'images/trail-04.jpg',
    'images/trail-05.jpg', 'images/trail-06.jpg',
    'images/trail-07.jpg', 'images/trail-08.jpg',
    'images/trail-09.jpg', 'images/trail-10.jpg',
    'images/trail-11.jpg', 'images/trail-12.jpg',
    'images/trail-13.jpg', 'images/trail-14.jpg',
    'images/trail-15.jpg', 'images/trail-16.jpg',
    'images/trail-17.jpg', 'images/trail-18.jpg',
    'images/trail-19.jpg', 'images/trail-20.jpg'
  ]
};

/* ═══════════════════════════════════════════════════════════
   INJECTION — NE PAS MODIFIER (remplit le DOM avant app.js)
   ═══════════════════════════════════════════════════════════ */
(() => {
  const C = window.SITE_CONTENT;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const set = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };

  document.title = C.brand.title;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', C.brand.description);

  // chrome
  set('.loader-wordmark', C.brand.name);
  set('.dock-wordmark', C.brand.name);
  set('.dock-link[href="#travaux"]', C.nav.proof);
  set('.dock-link[href="#explorer"]', C.nav.universes);
  set('.dock-cta', C.nav.cta);

  // 1 · accroche
  set('#heroKicker', C.brand.kicker);
  set('#heroLine1', C.hook.line1);
  const hls = $$('#heroLine2 .hl');
  if (hls.length === 2) { hls[0].textContent = C.hook.line2a; hls[1].textContent = C.hook.line2b; }
  const g1 = $('#grow1 img');
  if (g1) { g1.src = C.hook.image; g1.alt = C.hook.imageAlt; }
  $$('.floaters .fl img').forEach((img, i) => { if (C.hook.floaters[i]) img.src = C.hook.floaters[i]; });

  // 2 · positionnement (un span par mot)
  const intro = $('#spotIntro');
  if (intro) intro.innerHTML = C.positioning.split(' ').map((w) => `<span>${w}</span>`).join(' ');

  // 3 · démarche
  const fill = $('#fillText');
  if (fill) {
    fill.innerHTML = C.manifesto.text.replace(
      /\[\[(.+?)\]\]/,
      '<span class="boxed" id="boxedPhrase">$1<svg class="box-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="boxPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>'
    );
  }

  // 4 · preuve : masonry (8 photos) ou bento (4 features big/tall/tall/big)
  const head = $$('.coll-head > *');
  if (head.length === 4) {
    head[0].textContent = C.proof.kicker;
    head[1].textContent = C.proof.title;
    head[2].textContent = C.proof.sub;
    head[3].textContent = C.proof.meta;
  }
  const grid = $('#collGrid');
  if (grid && C.proof.layout === 'bento') {
    grid.className = 'bento-grid';
    grid.innerHTML = C.proof.features.map((f) =>
      `<figure class="card${f.size ? ' b-' + f.size : ''}"><div class="card-img"><img src="${f.illu}" alt="${f.title}"></div><figcaption>${f.title}<span class="mono">${f.meta}</span></figcaption></figure>`
    ).join('');
  } else if (grid) {
    grid.className = 'coll-grid';
    const SPEEDS = [-0.05, 0.06, -0.028, 0.085];
    grid.innerHTML = SPEEDS.map((s, ci) =>
      `<div class="col" data-pspeed="${s}">` +
      C.proof.projects.slice(ci * 2, ci * 2 + 2).map((p) =>
        `<figure class="card"><div class="card-img"><img src="${p.img}" alt="${p.title} — ${p.meta}"></div><figcaption>${p.title}<span class="mono">${p.meta}</span></figcaption></figure>`
      ).join('') + '</div>'
    ).join('');
  }

  // 5 · devise (train de mots-clés)
  set('#mottoKicker', C.motto.kicker);
  const mtrack = $('#mottoTrack');
  if (mtrack) mtrack.innerHTML = C.motto.words.map((w) => `<span class="mw">${w.word}</span>`).join('');

  // 6-7 · processus immersif (visuels posés un à un)
  set('#nw1', C.universes.introA);
  set('#nw2', C.universes.introB);
  set('#nw3', C.universes.introC);
  const g2 = $('#grow2 img');
  if (g2) g2.src = C.universes.image || (C.universes.items[0] || {}).img || g2.src;
  const psteps = $('#psteps');
  if (psteps) {
    psteps.innerHTML = C.universes.items.map((u) =>
      `<div class="pstep"><span class="pstep-meta mono ash">${u.meta}</span><h3>${u.name}</h3><p>${u.desc || ''}</p></div>`
    ).join('');
  }
  const sCta = $('#stepsCtaLink');
  if (sCta) sCta.childNodes[0].textContent = C.universes.cta;

  // 8 · preuve sociale — le chiffre qui frappe
  set('#figKicker', C.testimonial.kicker || '');
  const figM = String(C.testimonial.figure || '').trim().match(/^([^\d.,+-]*[+\u2212-]?)\s*(-?[\d.,]+)/);
  set('#figPre', figM ? figM[1] : '');
  set('#figVal', figM ? figM[2] : '');
  set('#figUnit', C.testimonial.unit || '');
  set('#quoteText', C.testimonial.quote);
  set('#quoteAuthor', C.testimonial.author);

  // 9 · objections
  C.objections.items.forEach((t, i) => set('#fs' + (i + 1), t));
  const fs4 = $('#fs4');
  if (fs4) {
    fs4.innerHTML = `${C.objections.finale} <span class="pill" id="pillPhrase">${C.objections.pill}<svg class="pill-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="pillPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>`;
  }
  $$('#trail img').forEach((img, i) => { img.src = C.trail[i % C.trail.length]; });

  // 10 · conversion
  set('.footer-kicker', C.contact.kicker);
  const mail = $('.footer-mail');
  if (mail) { mail.href = 'mailto:' + C.contact.email; mail.querySelector('.footer-mail-text').textContent = C.contact.email; }
  set('.footer-reassurance', C.contact.reassurance);
  const fname = $('#footerName');
  if (fname) { fname.textContent = C.brand.name; fname.setAttribute('aria-label', C.brand.name); }
  const bottom = $$('.footer-bottom > p');
  if (bottom.length === 3) {
    bottom[0].textContent = C.brand.copyright;
    bottom[1].innerHTML = C.brand.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('&nbsp;&nbsp;&nbsp;');
    bottom[2].textContent = C.brand.signature;
  }
})();
