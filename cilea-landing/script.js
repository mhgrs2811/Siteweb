(function () {
  "use strict";

  /* 1. Barre d'annonce — rotation toutes les 4s */
  const announceMsgs = document.querySelectorAll(".announce-msg");
  if (announceMsgs.length) {
    let announceIdx = 0;
    setInterval(function () {
      announceMsgs[announceIdx].classList.remove("is-active");
      announceIdx = (announceIdx + 1) % announceMsgs.length;
      announceMsgs[announceIdx].classList.add("is-active");
    }, 4000);
  }

  /* 2. Header sticky CTA après 400px de scroll */
  const stickyCta = document.getElementById("stickyCta");
  if (stickyCta) {
    window.addEventListener(
      "scroll",
      function () {
        stickyCta.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );
  }

  /* 3. Modale vidéo (hero + comparaison technique) */
  const videoModal = document.getElementById("videoModal");
  const openVideoModal = document.getElementById("openVideoModal");
  const closeVideoModal = document.getElementById("closeVideoModal");
  function toggleModal(open) {
    if (!videoModal) return;
    videoModal.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (openVideoModal) openVideoModal.addEventListener("click", () => toggleModal(true));
  if (closeVideoModal) closeVideoModal.addEventListener("click", () => toggleModal(false));
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === videoModal) toggleModal(false);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggleModal(false);
  });

  /* 6. Module 3D interactif — rotation au drag (souris + tactile) */
  const stage3d = document.getElementById("stage3d");
  const box3d = document.getElementById("box3d");
  const hotspotInfo = document.getElementById("hotspotInfo");

  if (box3d) {
    let rotY = -20;
    let rotX = -14;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let autoRotate = true;

    function applyRotation() {
      box3d.style.transform =
        "translateZ(-100px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    }
    applyRotation();

    function startDrag(x, y) {
      isDragging = true;
      autoRotate = false;
      lastX = x;
      lastY = y;
    }
    function moveDrag(x, y) {
      if (!isDragging) return;
      rotY += (x - lastX) * 0.4;
      rotX -= (y - lastY) * 0.3;
      rotX = Math.max(-45, Math.min(45, rotX));
      lastX = x;
      lastY = y;
      applyRotation();
    }
    function endDrag() {
      isDragging = false;
    }

    box3d.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener("mouseup", endDrag);

    box3d.addEventListener(
      "touchstart",
      (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY),
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY),
      { passive: true }
    );
    window.addEventListener("touchend", endDrag);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      (function autoSpin() {
        if (autoRotate) {
          rotY += 0.15;
          applyRotation();
        }
        requestAnimationFrame(autoSpin);
      })();
    }

    document.querySelectorAll(".hotspot").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (hotspotInfo) hotspotInfo.textContent = btn.dataset.info;
        autoRotate = false;
      });
    });
  }

  /* 7. Carrousel UGC — boutons précédent / suivant */
  const ugcCarousel = document.getElementById("ugcCarousel");
  const ugcPrev = document.getElementById("ugcPrev");
  const ugcNext = document.getElementById("ugcNext");
  function scrollCarousel(dir) {
    if (!ugcCarousel) return;
    const cardWidth = ugcCarousel.querySelector(".ugc-card")?.offsetWidth || 220;
    ugcCarousel.scrollBy({ left: dir * (cardWidth + 18), behavior: "smooth" });
  }
  if (ugcPrev) ugcPrev.addEventListener("click", () => scrollCarousel(-1));
  if (ugcNext) ugcNext.addEventListener("click", () => scrollCarousel(1));

  /* 11. Offres — sélection visuelle + résumé */
  const offerCards = document.querySelectorAll(".offer-card");
  const offerSummary = document.getElementById("offerSummary");
  const offerLabels = {
    decouverte: "Kit Découverte sélectionné — 29 €. Ajoutez-le au panier pour continuer.",
    signature: "Kit Signature sélectionné — 39 €. Le choix préféré de nos clientes.",
    rituel: "Le Rituel Complet sélectionné — 59 €. Meilleure valeur perçue.",
    abonnement: "Abonnement Recharge sélectionné — 19 €/mois, résiliable à tout moment.",
  };
  offerCards.forEach(function (card) {
    const selectBtn = card.querySelector(".offer-select");
    if (!selectBtn) return;
    selectBtn.addEventListener("click", function () {
      offerCards.forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      if (offerSummary) {
        offerSummary.textContent = offerLabels[card.dataset.offer] || "Formule sélectionnée.";
      }
    });
  });

  /* 12. Avis — filtres */
  const filterChips = document.querySelectorAll(".filter-chip");
  const reviewCards = document.querySelectorAll(".review-card");
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const filter = chip.dataset.filter;
      reviewCards.forEach(function (card) {
        const tags = card.dataset.tags || "";
        const show = filter === "all" || tags.includes(filter);
        card.hidden = !show;
      });
    });
  });

  /* Footer — newsletter (démo, sans backend) */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterConfirm = document.getElementById("newsletterConfirm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      newsletterForm.reset();
      if (newsletterConfirm) newsletterConfirm.hidden = false;
    });
  }
})();
