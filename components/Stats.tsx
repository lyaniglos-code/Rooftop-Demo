"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";
import { stats } from "@/data/site";
import { Reveal } from "./Reveal";

/**
 * Count-up stat band. Numbers spring from 0 when the band scrolls into view —
 * the classic "proof bar" any business site needs, done with motion values so
 * the digits tween smoothly instead of stepping.
 */
export function Stats() {
  return (
    <section className="border-y border-ink-950/[0.07] bg-paper-200/50">
      <div className="mx-auto grid max-w-page grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            <p className="mt-2 text-sm uppercase tracking-wider text-ink-950/50">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CountUp({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, mv, value, reduce]);

  return (
    <span ref={ref} className="copper-clip font-display text-4xl font-bold md:text-5xl">
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
