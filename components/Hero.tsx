"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { site } from "@/data/site";
import { FinishedHouse } from "./RoofBuilder";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — the finished Copperline house is the centerpiece, floating beside
 * the headline. "Fall into the sky" exit borrowed from the portfolio: as the
 * hero scrolls out, content scales toward the viewer and fades. A rooftop
 * skyline silhouette sits at the bottom with slower parallax.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const zoomScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const zoomOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const houseY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-6 px-6 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={reduce ? undefined : { scale: zoomScale, opacity: zoomOpacity }}
          className="relative z-10 max-w-3xl pb-32 md:pb-24"
        >
          <motion.p
            variants={item}
            className="mb-7 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-ink-950/50"
          >
            <span className="inline-block h-px w-8 bg-copper/70" />
            {site.serviceArea}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.02] tracking-tightest text-ink-950 sm:text-6xl md:text-7xl lg:text-[4.8rem]"
          >
            The last roof
            <br />
            your house will
            <br />
            <span className="copper-clip">ever need.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-950/70 md:text-xl"
          >
            {site.positioning}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#quote"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-copper px-8 py-4 text-base font-semibold text-white transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
            >
              <span className="relative z-10">Get a free inspection</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <span className="absolute inset-0 -z-0 bg-copper-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
            <a
              href="#build"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-950/15 px-8 py-4 text-base font-semibold text-ink-950 transition-all duration-300 ease-smooth hover:border-ink-950/40 hover:bg-ink-950/5"
            >
              Watch a roof go on
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>

          {/* Trust chips */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-950/55"
          >
            <span className="flex items-center gap-2">
              <Star /> 4.9 from 700+ reviews
            </span>
            <span className="hidden h-3 w-px bg-ink-950/15 sm:block" />
            <span>Licensed &amp; insured</span>
            <span className="hidden h-3 w-px bg-ink-950/15 sm:block" />
            <span>50-yr material warranty</span>
          </motion.div>
        </motion.div>

        {/* The house — finished, floating, front and center */}
        <motion.div
          style={reduce ? undefined : { y: houseY, opacity: zoomOpacity }}
          className="relative hidden md:block"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <FinishedHouse className="h-[62vh] w-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Rooftop skyline silhouette — parallax anchor */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: skylineY }}
        className="pointer-events-none absolute inset-x-0 bottom-0"
      >
        <Skyline />
      </motion.div>

      {/* Scroll hint */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-ink-950/25 p-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-copper" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function Star() {
  return (
    <svg className="h-4 w-4 text-copper" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
    </svg>
  );
}

/** Gabled rooftops silhouette along the hero's bottom edge. */
function Skyline() {
  return (
    <svg
      viewBox="0 0 1440 190"
      preserveAspectRatio="xMidYMax slice"
      className="block h-[120px] w-full md:h-[160px]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyline-glow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgb(var(--accent) / 0.08)" />
          <stop offset="100%" stopColor="rgb(var(--accent) / 0)" />
        </linearGradient>
      </defs>
      <rect y="40" width="1440" height="150" fill="url(#skyline-glow)" />
      <path
        d="M0 190 L0 130 L60 130 L130 68 L200 130 L228 130 L228 96 L244 96 L244 116 L290 74 L360 138 L430 138 L430 108 L500 52 L570 108 L570 190 Z
           M540 190 L540 128 L610 128 L680 76 L750 128 L780 128 L780 96 L798 96 L798 112 L850 66 L925 134 L1000 134 L1000 190 Z
           M970 190 L970 122 L1040 122 L1110 58 L1180 122 L1210 122 L1210 88 L1228 88 L1228 106 L1280 62 L1355 130 L1440 130 L1440 190 Z"
        fill="#e5ddcd"
      />
      <path
        d="M130 68 L200 130 M290 74 L360 138 M500 52 L570 108 M680 76 L750 128 M850 66 L925 134 M1110 58 L1180 122 M1280 62 L1355 130"
        stroke="rgb(var(--accent) / 0.4)"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Lit windows */}
      <g fill="rgb(var(--accent) / 0.45)">
        <rect x="160" y="145" width="9" height="12" rx="1" />
        <rect x="480" y="120" width="9" height="12" rx="1" />
        <rect x="700" y="142" width="9" height="12" rx="1" />
        <rect x="880" y="148" width="9" height="12" rx="1" />
        <rect x="1090" y="136" width="9" height="12" rx="1" />
        <rect x="1300" y="144" width="9" height="12" rx="1" />
      </g>
    </svg>
  );
}
