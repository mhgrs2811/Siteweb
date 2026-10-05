/* Has Pide Kebap · comportements du site (sans dépendance) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Horaires : à confirmer avec le restaurant avant la mise en ligne.
     Clé = jour JS (0 = dimanche). null = fermé.
     ------------------------------------------------------------------ */
  var HOURS = {
    0: ["11:00", "23:00"],
    1: ["11:00", "23:00"],
    2: ["11:00", "23:00"],
    3: ["11:00", "23:00"],
    4: ["11:00", "23:00"],
    5: ["11:00", "23:00"],
    6: ["11:00", "23:00"]
  };
  var TIME_ZONE = "Europe/Brussels";
  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return +p[0] * 60 + +p[1];
  }

  function nowInBrussels() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      return { day: day, minutes: +map.hour * 60 + +map.minute };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function nextOpening(day) {
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      if (HOURS[d]) return { inDays: i, day: d, time: HOURS[d][0] };
    }
    return null;
  }

  function statusLabel() {
    var now = nowInBrussels();
    var today = HOURS[now.day];
    if (today && now.minutes >= toMinutes(today[0]) && now.minutes < toMinutes(today[1])) {
      return { open: true, text: "Ouvert · jusqu’à " + today[1] };
    }
    if (today && now.minutes < toMinutes(today[0])) {
      return { open: false, text: "Fermé · ouvre à " + today[0] };
    }
    var next = nextOpening(now.day);
    if (!next) return { open: false, text: "Fermé" };
    var when = next.inDays === 1 ? "demain" : DAYS[next.day];
    return { open: false, text: "Fermé · ouvre " + when + " à " + next.time };
  }

  function renderStatus() {
    var s = statusLabel();
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.classList.toggle("is-closed", !s.open);
      var label = el.querySelector("[data-status-text]");
      if (label) label.textContent = s.text;
    });
  }

  function renderHoursTable() {
    var today = nowInBrussels().day;
    document.querySelectorAll("[data-hours] tr[data-day]").forEach(function (row) {
      var d = +row.getAttribute("data-day");
      var cell = row.querySelector("td");
      cell.textContent = HOURS[d] ? HOURS[d][0] + " – " + HOURS[d][1] : "Fermé";
      row.classList.toggle("is-today", d === today);
    });
  }

  renderStatus();
  renderHoursTable();
  setInterval(renderStatus, 60 * 1000);

  /* ------------------------------------------------------------------
     En-tête : transparent sur le hero, opaque ensuite
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector("[data-hero]");
  if (header && hero && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none";
    hero.style.position = "relative";
    hero.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-solid", !entries[0].isIntersecting);
    }).observe(sentinel);
  } else if (header) {
    header.classList.add("is-solid");
  }

  /* ------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------ */
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.getElementById("mobile-nav");
  function setMenu(open) {
    if (!toggle || !panel) return;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("[data-menu-label]").textContent = open ? "Fermer" : "Menu";
    document.body.classList.toggle("is-locked", open);
    if (header) header.classList.toggle("is-solid", open || window.scrollY > 40 || !hero);
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () { setMenu(panel.hidden); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) setMenu(false); });
  }

  /* ------------------------------------------------------------------
     Fenêtre « Commander »
     ------------------------------------------------------------------ */
  var dialog = document.getElementById("order");
  if (dialog) {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-order]");
      if (!trigger) return;
      e.preventDefault();
      setMenu(false);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
  }

  /* Liens en attente (réseaux sociaux, plateformes) : ne pas remonter en haut de page */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-pending]")) e.preventDefault();
  });

  /* ------------------------------------------------------------------
     Carte : catégorie active dans la navigation
     ------------------------------------------------------------------ */
  var spyLinks = document.querySelectorAll("[data-spy] a[href^='#']");
  if (spyLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      spyLinks.forEach(function (a) {
        var id = a.getAttribute("href").slice(1);
        if (!current && visible[id]) current = id;
      });
      if (!current) return;
      spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
      byId[current].classList.add("is-active");
      var list = byId[current].closest("ul");
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: byId[current].offsetLeft - 16, behavior: "smooth" });
      }
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* Année du pied de page */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
