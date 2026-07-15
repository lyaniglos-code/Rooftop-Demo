"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Scroll-linked depth wrapper — ported from the YANIGLOS portfolio.
 *
 * As a section enters the viewport it rises from "deeper" in the page:
 * slightly smaller, tilted back, dimmed — then stands up to full presence.
 * As it leaves at the top it scales toward the viewer and softly recedes,
 * so scrolling reads like moving through layers instead of sliding a flat
 * page. Content sits at 100% scale/opacity through the readable window;
 * the effect only lives at the edges. Transforms + opacity only, and it
 * collapses to a plain <div> under prefers-reduced-motion.
 */
export function DepthSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["end 0.4", "end start"],
  });

  const enterScale = useTransform(enter, [0, 1], [0.94, 1]);
  const enterY = useTransform(enter, [0, 1], [70, 0]);
  const rotateX = useTransform(enter, [0, 1], [5, 0]);
  const enterOpacity = useTransform(enter, [0, 1], [0.3, 1]);

  const exitScale = useTransform(exit, [0, 1], [1, 1.045]);
  const exitOpacity = useTransform(exit, [0, 1], [1, 0.45]);

  const scale = useTransform(
    [enterScale, exitScale],
    (latest: number[]) => latest[0] * latest[1]
  );
  const opacity = useTransform(
    [enterOpacity, exitOpacity],
    (latest: number[]) => Math.min(latest[0], latest[1])
  );

  if (reduce) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        scale,
        y: enterY,
        rotateX,
        opacity,
        transformPerspective: 1200,
        transformOrigin: "50% 0%",
      }}
    >
      {children}
    </motion.div>
  );
}
