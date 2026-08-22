(function () {
  "use strict";

  // ---------- Année dynamique dans le footer ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header : ombre au scroll ----------
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Menu mobile ----------
  var burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    var isOpen = header.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  document.querySelectorAll("#mobile-menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      header.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- Indicateur "ouvert / fermé" ----------
  // Horaires : lundi-samedi 12h-23h, dimanche fermé (heure de Bruxelles)
  var statusPill = document.getElementById("status-pill");
  var statusText = document.getElementById("status-text");

  function updateOpenStatus() {
    var now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Brussels" })
    );
    var day = now.getDay(); // 0 = dimanche
    var minutes = now.getHours() * 60 + now.getMinutes();
    var opens = 12 * 60;
    var closes = 23 * 60;
    var isOpen = day !== 0 && minutes >= opens && minutes < closes;

    if (isOpen) {
      statusPill.classList.remove("is-closed");
      statusText.textContent = "Ouvert maintenant · jusqu'à 23h";
    } else {
      statusPill.classList.add("is-closed");
      statusText.textContent =
        day === 0 ? "Fermé aujourd'hui (dimanche)" : "Fermé · ouvre à 12h";
    }
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  // ---------- Animation d'apparition au scroll ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
