/**
 * En-tête : état « défilé » (fond plein) + menu mobile accessible.
 */
function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = header.querySelector<HTMLElement>('[data-menu-panel]');

  // --- État défilé ---
  const onScroll = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Menu mobile ---
  if (!toggle || !panel) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    header.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open && document.activeElement && panel.contains(document.activeElement)) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Ferme le menu si l'on repasse en desktop.
  const mq = window.matchMedia('(min-width: 64em)');
  mq.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

initHeader();
