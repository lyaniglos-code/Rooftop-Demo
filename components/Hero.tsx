"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { heroFacts, site } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-bleed crew photo. On the way out, the photo pushes in and darkens
 * while the two headline lines slide apart in opposite directions.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.3]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const shade = useTransform(scrollYProgress, [0, 1], [0.3, 0.85]);
  const lineA = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const lineB = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const rise = (delay: number) => ({
    initial: { y: reduce ? 0 : "105%" },
    animate: { y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-coal-950 pt-32"
    >
      <motion.img
        src="/images/hero.jpg"
        alt="Two roofers in safety harnesses working on a shingle roof"
        fetchPriority="high"
        style={reduce ? undefined : { scale: imgScale, y: imgY }}
        className="absolute inset-0 h-full w-full object-cover object-[65%_30%]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 0.45 : shade }}
        className="absolute inset-0 bg-coal-950"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-coal-950/75 to-transparent md:w-2/3" />

      <div className="relative mx-auto w-full max-w-page px-5 pb-8 md:px-8 md:pb-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 bg-coal-950/70 px-3 py-1.5 text-sm font-semibold text-bone/85"
        >
          <span className="h-2 w-2 bg-copper" />
          Roofing contractor in {site.serviceArea}
        </motion.p>

        <h1 className="font-display text-[clamp(3.9rem,14vw,11rem)] font-black uppercase leading-[0.84] tracking-tight">
          <motion.span className="block" style={reduce ? undefined : { x: lineA, opacity: fade }}>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...rise(0.1)}>
                Roofs built
              </motion.span>
            </span>
          </motion.span>
          <motion.span className="block text-copper" style={reduce ? undefined : { x: lineB, opacity: fade }}>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...rise(0.22)}>
                to take a hit.
              </motion.span>
            </span>
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-lg leading-relaxed text-bone/80">
            Replacements, storm repair and metal roofs. We inspect from the
            roof, not the driveway, and put the price in writing before any
            work starts.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#quote"
              className="group inline-flex items-center justify-center gap-3 bg-copper px-7 py-4 font-bold uppercase tracking-wide text-coal-950 transition-colors hover:bg-bone"
            >
              Book a free inspection
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center border border-bone/30 px-7 py-4 font-bold uppercase tracking-wide text-bone transition-colors hover:border-bone"
            >
              Call {site.phone}
            </a>
          </div>
        </motion.div>

        <ul className="mt-10 grid border-t border-bone/15 pt-5 text-sm font-medium text-bone/70 sm:grid-cols-3">
          {heroFacts.map((f) => (
            <li key={f} className="flex items-center gap-2 py-1">
              <svg className="h-4 w-4 text-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
