"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * One morning sky, site-wide. A fixed backdrop of soft copper and teal
 * washes sits behind every section, and the page scrolls through it at a
 * slower rate — gentle parallax landmarks instead of the old starfield.
 * Transform-only movement; still under reduced motion.
 */

const SKY_H = "480vh";

export function DuskSky() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const washY = useTransform(scrollY, (v) => v * (reduce ? 0 : -0.12));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        style={{ y: washY, height: SKY_H }}
        className="absolute inset-x-0 top-0 will-change-transform"
      >
        <div
          className="absolute right-[-14%] top-[1%] h-[60vh] w-[60vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.10), rgb(var(--accent) / 0.03) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute left-[-16%] top-[22%] h-[54vh] w-[54vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--sky) / 0.10), rgb(var(--sky) / 0.03) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute right-[-12%] top-[48%] h-[56vh] w-[56vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.08), rgb(var(--sky) / 0.04) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute left-[-10%] top-[72%] h-[52vh] w-[58vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.10), transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}
