import { useState, useRef, useEffect, useCallback } from 'react';
import { PLANETS } from '../data/planetData.js';

export function usePlanetNavigation(disabled = false, containerRef = null) {
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const snapTimer = useRef(null);

  /* ─── helpers ─────────────────────────────────────────────── */

  /** Get the parent scroll-jail div and dvh */
  const getJail = useCallback(() => {
    const jail = containerRef?.current?.parentElement;
    const dvh = window.innerHeight;
    return { jail, dvh };
  }, [containerRef]);

  /** Scroll page so planet `n` is centred in the viewport */
  const scrollToPlanet = useCallback((n) => {
    const { jail, dvh } = getJail();
    if (!jail) return;
    const clamped = Math.max(0, Math.min(PLANETS.length - 1, n));
    window.scrollTo({ top: jail.offsetTop + clamped * dvh, behavior: 'smooth' });
  }, [getJail]);

  /* ─── drive idx from scroll ────────────────────────────────── */
  useEffect(() => {
    if (disabled) return;
    const { jail } = getJail();
    if (!jail) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const dvh = window.innerHeight;
        const scrolled = window.scrollY - jail.offsetTop;
        const newIdx = Math.max(0, Math.min(
          PLANETS.length - 1,
          Math.round(scrolled / dvh)
        ));

        if (newIdx !== idxRef.current) {
          idxRef.current = newIdx;
          setIdx(newIdx);
        }

        // Debounced snap: snap to nearest planet after scroll stops
        clearTimeout(snapTimer.current);
        snapTimer.current = setTimeout(() => {
          const exact = jail.offsetTop + idxRef.current * dvh;
          // Only snap when inside the jail (planet section visible)
          if (
            window.scrollY >= jail.offsetTop &&
            window.scrollY <= jail.offsetTop + jail.offsetHeight - dvh + 1
          ) {
            window.scrollTo({ top: exact, behavior: 'smooth' });
          }
        }, 150);

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // sync on mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(snapTimer.current);
    };
  }, [disabled, getJail]);

  /* ─── keyboard ─────────────────────────────────────────────── */
  useEffect(() => {
    if (disabled) return;
    const fn = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollToPlanet(idxRef.current + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') scrollToPlanet(idxRef.current - 1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [scrollToPlanet, disabled]);

  /* ─── public API ───────────────────────────────────────────── */
  // `go` is used by Sidebar clicks — scrolls page to that planet
  return { idx, go: scrollToPlanet };
}