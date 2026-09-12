"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { stats } from "@/data/site";
import { Reveal } from "./Reveal";

/** Ruled stat grid; the numbers count up when the band scrolls into view. */
export function Stats() {
  return (
    <section className="border-y border-bone/10 bg-coal-950">
      <div className="mx-auto grid max-w-page grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={`border-bone/10 px-5 py-12 md:border-r md:px-8 md:py-16 md:last:border-r-0 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b md:border-b-0" : ""}`}
          >
            <p className="font-display text-6xl font-black leading-none md:text-8xl">
              <CountUp value={s.value} decimals={s.decimals ?? 0} />
              <span className="text-copper">{s.suffix}</span>
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-bone/55">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CountUp({ value, decimals }: { value: number; decimals: number }) {
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
    const controls = animate(mv, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, mv, value, reduce]);

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
    </span>
  );
}
