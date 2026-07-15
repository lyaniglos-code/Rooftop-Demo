"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Inertial scroll smoothing (Lenis) — ported from the YANIGLOS portfolio.
 * Raw wheel input steps the page ~100px per frame; every scroll-linked effect
 * (the roof build, depth tilts, sky parallax) would jump with it. Lenis eases
 * the real scroll position between inputs so those effects interpolate at
 * 60fps. Drives native window scrolling, so position: sticky pins keep
 * working. Reduced-motion users keep untouched native scrolling.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    // Smooth anchor navigation with the sections' 96px header offset.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96, duration: 1.1 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
