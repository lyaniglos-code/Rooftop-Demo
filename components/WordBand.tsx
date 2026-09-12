"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const WORDS = [
  "Tear-offs",
  "Storm repair",
  "Standing seam",
  "Gutters",
  "Skylights",
  "Inspections",
];

/**
 * Two rows of oversized type that slide in opposite directions as the band
 * crosses the screen. Driven by scroll position, not a timer, so it moves
 * exactly as fast as the reader does.
 */
export function WordBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xA = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);
  const row = [...WORDS, ...WORDS];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="overflow-hidden border-b border-bone/10 bg-coal-950 py-8 md:py-12"
    >
      <motion.div
        style={reduce ? undefined : { x: xA }}
        className="flex w-max items-center gap-8 whitespace-nowrap font-display text-6xl font-black uppercase leading-none md:gap-12 md:text-8xl"
      >
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-12">
            {w}
            <span className="h-3 w-3 bg-copper md:h-4 md:w-4" />
          </span>
        ))}
      </motion.div>
      <motion.div
        style={reduce ? undefined : { x: xB }}
        className="text-outline mt-3 flex w-max items-center gap-8 whitespace-nowrap font-display text-6xl font-black uppercase leading-none md:gap-12 md:text-8xl"
      >
        {[...row].reverse().map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </motion.div>
    </div>
  );
}
