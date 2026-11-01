/**
 * sessionStorage can throw (private windows, blocked site data), so every access is wrapped.
 * The site must work identically when storage is unavailable.
 */
export function readFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    /* storage unavailable: ignore */
  }
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
