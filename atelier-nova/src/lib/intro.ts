"use client";

/**
 * Coordination entre le préchargeur et l’intro du hero.
 * Le préchargeur appelle `fireIntro()` quand il se retire (ou tout de suite
 * s’il n’est pas affiché) ; le hero s’abonne avec `onIntro()`.
 */
let done = false;
const listeners = new Set<() => void>();

export function onIntro(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function fireIntro() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}
