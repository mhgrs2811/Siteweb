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

  /* Liens en attente (réseaux sociaux) : ne pas remonter en haut de page */
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

  /* ------------------------------------------------------------------
     Réservation
     Les demandes partent vers functions/api/reservation.js, qui les
     vérifie et les transmet par e-mail au restaurant. endpoint vide =
     démonstration (rien n'est envoyé), utilisé par les aperçus autonomes.
     Les règles de créneaux sont reprises côté serveur : garder les deux alignées.
     ------------------------------------------------------------------ */
  var RESERVATION = {
    endpoint: "/api/reservation",
    turnstileSiteKey: "",    // clé publique Cloudflare Turnstile, si la vérification anti-robot est activée
    daysAhead: 14,           // jours proposés en pastilles
    maxDaysAhead: 60,        // limite du champ « autre date »
    slotStep: 30,            // minutes entre deux créneaux
    lastSlotBeforeClose: 60, // dernier créneau une heure avant la fermeture
    minNotice: 60,           // délai minimum pour réserver le jour même
    lunchUntil: "16:00",     // sépare les créneaux « Déjeuner » et « Dîner »
    phone: "02 203 83 00"
  };

  var bookingForm = document.querySelector("[data-reservation]");
  if (bookingForm) initReservation(bookingForm);

  function initReservation(form) {
    var datesEl = form.querySelector("[data-dates]");
    var slotsEl = form.querySelector("[data-slots]");
    var otherDate = form.querySelector("#date-other");
    var moreWrap = form.querySelector("[data-guests-more]");
    var moreSelect = form.querySelector("#guests-more");
    var formError = form.querySelector("[data-form-error]");
    var submit = form.querySelector("[type='submit']");
    var recap = form.querySelector("[data-recap]");
    var done = document.querySelector("[data-booking-done]");
    var state = { guests: 2, date: null, time: null };
    var startedAt = Date.now();
    var LINK_RE = /(https?:\/\/|www\.|\[url|<a\s)/i;
    var MESSAGES = {
      guests: "Indiquez le nombre de personnes.",
      date: "Choisissez une date.",
      time: "Choisissez un horaire.",
      name: "Indiquez votre nom.",
      phone: "Indiquez un numéro valide, par exemple 0470 12 34 56.",
      email: "Cette adresse e-mail n’est pas valide.",
      notes: "Les liens ne sont pas acceptés dans la demande particulière.",
      consent: "Cochez cette case pour envoyer votre demande."
    };

    // Vérification anti-robot facultative (Cloudflare Turnstile)
    if (RESERVATION.endpoint && RESERVATION.turnstileSiteKey) {
      var widget = document.createElement("div");
      widget.className = "cf-turnstile";
      widget.setAttribute("data-sitekey", RESERVATION.turnstileSiteKey);
      widget.setAttribute("data-language", "fr");
      form.querySelector(".form-actions").before(widget);
      var tsScript = document.createElement("script");
      tsScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      tsScript.async = true;
      document.head.appendChild(tsScript);
    }

    var fmtDow = new Intl.DateTimeFormat("fr-BE", { weekday: "short", timeZone: "UTC" });
    var fmtMonth = new Intl.DateTimeFormat("fr-BE", { month: "short", timeZone: "UTC" });
    var fmtLong = new Intl.DateTimeFormat("fr-BE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function toHHMM(min) { return pad(Math.floor(min / 60)) + ":" + pad(min % 60); }
    function fromISO(iso) { return new Date(iso + "T12:00:00Z"); }
    function addDays(iso, n) {
      var d = fromISO(iso);
      d.setUTCDate(d.getUTCDate() + n);
      return d.toISOString().slice(0, 10);
    }
    function todayISO() {
      try {
        return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      } catch (e) {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      }
    }
    function shortLabel(text) { return text.replace(".", ""); }
    function longDate(iso) {
      var t = fmtLong.format(fromISO(iso));
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
    function guestsLabel(n) { return n + (n > 1 ? " personnes" : " personne"); }

    function slotsFor(iso) {
      var hours = HOURS[fromISO(iso).getUTCDay()];
      if (!hours) return [];
      var first = toMinutes(hours[0]);
      var last = toMinutes(hours[1]) - RESERVATION.lastSlotBeforeClose;
      var earliest = iso === todayISO() ? nowInBrussels().minutes + RESERVATION.minNotice : -1;
      var slots = [];
      for (var m = first; m <= last; m += RESERVATION.slotStep) {
        slots.push({ time: toHHMM(m), minutes: m, disabled: m < earliest });
      }
      return slots;
    }
    function isBookable(iso) {
      return slotsFor(iso).some(function (s) { return !s.disabled; });
    }

    function renderDates() {
      var today = todayISO();
      var html = "";
      for (var i = 0; i < RESERVATION.daysAhead; i++) {
        var iso = addDays(today, i);
        var d = fromISO(iso);
        var open = isBookable(iso);
        var dow = i === 0 ? "Auj." : i === 1 ? "Demain" : shortLabel(fmtDow.format(d));
        html += '<label class="chip"><input type="radio" name="date" value="' + iso + '"' +
          (open ? "" : " disabled") + ' aria-label="' + longDate(iso) + (open ? "" : ", indisponible") + '">' +
          '<span><span class="date__dow">' + dow + '</span><span class="date__day">' + d.getUTCDate() +
          '</span><span class="date__month">' + shortLabel(fmtMonth.format(d)) + "</span></span></label>";
      }
      datesEl.innerHTML = html;
      otherDate.min = today;
      otherDate.max = addDays(today, RESERVATION.maxDaysAhead);
    }

    function renderSlots() {
      if (!state.date) {
        slotsEl.innerHTML = '<p class="slots-empty">Choisissez d’abord une date.</p>';
        return;
      }
      var slots = slotsFor(state.date);
      if (!slots.some(function (s) { return !s.disabled; })) {
        state.time = null;
        slotsEl.innerHTML = '<p class="slots-empty">Plus de créneau disponible ce jour-là. Choisissez une autre date ou appelez-nous au ' + RESERVATION.phone + ".</p>";
        return;
      }
      var lunch = toMinutes(RESERVATION.lunchUntil);
      var groups = [
        ["Déjeuner", slots.filter(function (s) { return s.minutes < lunch; })],
        ["Dîner", slots.filter(function (s) { return s.minutes >= lunch; })]
      ];
      var stillValid = slots.some(function (s) { return s.time === state.time && !s.disabled; });
      if (!stillValid) state.time = null;
      slotsEl.innerHTML = groups.filter(function (g) { return g[1].length; }).map(function (g) {
        return '<p class="step__sub">' + g[0] + '</p><div class="chips">' + g[1].map(function (s) {
          return '<label class="chip"><input type="radio" name="time" value="' + s.time + '"' +
            (s.disabled ? " disabled" : "") + (s.time === state.time ? " checked" : "") +
            "><span>" + s.time + "</span></label>";
        }).join("") + "</div>";
      }).join("");
    }

    function renderSummary() {
      var values = {
        guests: state.guests ? guestsLabel(state.guests) : "",
        date: state.date ? longDate(state.date) : "",
        time: state.time || ""
      };
      Object.keys(values).forEach(function (key) {
        var dd = document.querySelector('[data-sum="' + key + '"]');
        if (!dd) return;
        dd.textContent = values[key] || "—";
        dd.classList.toggle("is-empty", !values[key]);
      });
      if (recap) {
        recap.textContent = [values.guests, values.date, values.time].filter(Boolean).join(" · ");
      }
    }

    function setError(name, message) {
      var slot = form.querySelector('[data-error-for="' + name + '"]');
      if (slot) slot.textContent = message || "";
      var field = form.querySelector("#" + name);
      if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
      // Plus aucun champ en erreur : on retire aussi le message général
      if (!message && formError.textContent) {
        var remaining = [].some.call(form.querySelectorAll("[data-error-for]"), function (el) { return el.textContent; });
        if (!remaining) formError.textContent = "";
      }
    }

    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "guests") {
        var more = t.value === "more";
        moreWrap.hidden = !more;
        state.guests = more ? +moreSelect.value : +t.value;
        setError("guests");
      } else if (t === moreSelect) {
        state.guests = +moreSelect.value;
      } else if (t.name === "date") {
        state.date = t.value;
        otherDate.value = "";
        setError("date");
        renderSlots();
      } else if (t === otherDate) {
        if (!otherDate.value) return;
        form.querySelectorAll("input[name='date']").forEach(function (r) { r.checked = false; });
        var inRange = otherDate.value >= otherDate.min && otherDate.value <= otherDate.max;
        state.date = inRange ? otherDate.value : null;
        setError("date", inRange ? "" : "Choisissez une date dans les " + RESERVATION.maxDaysAhead + " prochains jours.");
        renderSlots();
      } else if (t.name === "time") {
        state.time = t.value;
        setError("time");
      } else if (t.id === "consent" && t.checked) {
        setError("consent");
      }
      renderSummary();
    });

    form.addEventListener("input", function (e) {
      if (e.target.id && e.target.getAttribute("aria-invalid") === "true") setError(e.target.id);
    });

    function validate() {
      var errors = [];
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var email = form.elements.email;
      var digits = phone.replace(/\D/g, "");
      var notes = form.elements.notes.value;
      var checks = [
        ["guests", !state.guests],
        ["date", !state.date],
        ["time", !state.time],
        ["name", name.length < 2 || /[<>]/.test(name) || LINK_RE.test(name)],
        ["phone", digits.length < 9 || digits.length > 15 || !/^[0-9+()./\s-]+$/.test(phone)],
        ["email", email.value.trim() !== "" && !email.validity.valid],
        ["notes", notes.length > 500 || LINK_RE.test(notes)],
        ["consent", !form.elements.consent.checked]
      ];
      checks.forEach(function (c) {
        setError(c[0], c[1] ? MESSAGES[c[0]] : "");
        if (c[1]) errors.push(c[0]);
      });
      return errors;
    }

    function focusField(name) {
      var target = form.querySelector("#" + name) ||
        form.querySelector("input[name='" + name + "']:not(:disabled)");
      if (!target) return;
      target.focus({ preventScroll: true });
      target.closest("fieldset, .field, .consent").scrollIntoView({ block: "center", behavior: "smooth" });
    }

    function showDone(firstName, demo) {
      var text = (firstName ? "Merci " + firstName + ". " : "Merci. ") +
        "Votre demande pour " + guestsLabel(state.guests) + ", " + longDate(state.date).toLowerCase() +
        " à " + state.time + ", a bien été transmise. Nous vous confirmons la table par téléphone ou par e-mail.";
      done.querySelector("[data-done-text]").textContent = text;
      done.querySelector("[data-demo-note]").hidden = !demo;
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ block: "start" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formError.textContent = "";
      var errors = validate();
      if (errors.length) {
        formError.textContent = errors.length > 1 ? "Quelques informations manquent : voir les champs signalés." : "Une information manque : voir le champ signalé.";
        focusField(errors[0]);
        return;
      }
      var firstName = form.elements.name.value.trim().split(/\s+/)[0];
      // Champ piège rempli : un robot. On affiche une confirmation sans rien envoyer.
      if (form.elements.website.value) { showDone(firstName, false); return; }

      var tsField = form.querySelector("[name='cf-turnstile-response']");
      var payload = {
        guests: state.guests,
        date: state.date,
        time: state.time,
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        notes: form.elements.notes.value.trim(),
        consent: form.elements.consent.checked,
        website: form.elements.website.value,
        elapsed: Date.now() - startedAt,
        turnstile: tsField ? tsField.value : undefined
      };

      submit.setAttribute("aria-busy", "true");
      submit.disabled = true;

      var request;
      if (!RESERVATION.endpoint) {
        request = new Promise(function (resolve) { setTimeout(resolve, 700); });
      } else {
        var controller = "AbortController" in window ? new AbortController() : null;
        var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
        request = fetch(RESERVATION.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined
        }).then(function (res) {
          if (timer) clearTimeout(timer);
          if (res.ok) return;
          return res.json().catch(function () { return {}; }).then(function (body) {
            var err = new Error("HTTP " + res.status);
            err.status = res.status;
            err.body = body || {};
            throw err;
          });
        });
      }

      var callUs = 'appelez-nous au <a href="tel:+3222038300">' + RESERVATION.phone + "</a>.";
      request.then(function () {
        showDone(firstName, !RESERVATION.endpoint);
      }).catch(function (err) {
        var body = (err && err.body) || {};
        if (body.error === "invalid" && body.fields && body.fields.length) {
          body.fields.forEach(function (f) {
            setError(f, f === "time" ? "Ce créneau n’est plus disponible. Choisissez-en un autre." : MESSAGES[f] || "Vérifiez ce champ.");
          });
          if (body.fields.indexOf("time") !== -1) renderSlots();
          formError.textContent = "Vérifiez les champs signalés.";
          focusField(body.fields[0]);
        } else if (body.error === "rate_limited") {
          formError.innerHTML = "Plusieurs demandes viennent d’être envoyées depuis cette connexion. Réessayez plus tard ou " + callUs;
        } else if (body.error === "captcha") {
          formError.innerHTML = "La vérification anti-robot n’a pas abouti. Rechargez la page ou " + callUs;
        } else {
          formError.innerHTML = "L’envoi n’a pas abouti. Réessayez dans un instant ou " + callUs;
        }
        if (window.turnstile && RESERVATION.turnstileSiteKey) window.turnstile.reset();
      }).then(function () {
        submit.removeAttribute("aria-busy");
        submit.disabled = false;
      });
    });

    renderDates();
    renderSlots();
    renderSummary();
  }

  /* Année du pied de page */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
