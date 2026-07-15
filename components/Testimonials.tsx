"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/data/site";
import { Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Testimonial carousel — auto-advances every 6s (paused on hover and under
 * reduced motion), with directional slide + blur transitions and dot/arrow
 * controls. AnimatePresence handles the crossfade choreography.
 */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => {
    setState(([i]) => [
      (i + delta + testimonials.length) % testimonials.length,
      delta,
    ]);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, reduce, go]);

  const t = testimonials[index];

  return (
    <section className="border-t border-ink-950/[0.07]">
      <div
        className="mx-auto max-w-page px-6 py-24 md:px-8 md:py-32"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            Word travels
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-5xl">
            Neighbors talk about <span className="copper-clip">their roofs.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-14 min-h-[240px] max-w-3xl md:min-h-[210px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: 60 * dir, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -60 * dir, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: EASE }}
                className="text-center"
              >
                <Quote />
                <blockquote className="mt-5 text-balance font-display text-xl leading-relaxed text-ink-950/85 md:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6">
                  <span className="font-semibold text-ink-950">{t.name}</span>
                  <span className="mx-2 text-ink-950/30">·</span>
                  <span className="text-sm text-ink-950/55">{t.role}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <CarouselButton onClick={() => go(-1)} label="Previous testimonial" flip />
          <div className="flex gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-400 ease-smooth ${
                  i === index ? "w-7 bg-copper" : "w-2 bg-ink-950/20 hover:bg-ink-950/40"
                }`}
              />
            ))}
          </div>
          <CarouselButton onClick={() => go(1)} label="Next testimonial" />
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  onClick,
  label,
  flip = false,
}: {
  onClick: () => void;
  label: string;
  flip?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/15 text-ink-950/60 transition-all duration-300 hover:border-copper/60 hover:text-copper"
    >
      <svg
        className={`h-4 w-4 ${flip ? "rotate-180" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

function Quote() {
  return (
    <svg className="mx-auto h-8 w-8 text-copper/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 8c-2.8 0-5 2.2-5 5s2.2 5 5 5c.3 0 .6 0 .9-.1C10.1 19.7 8.6 21 7 21v2c4.4 0 8-3.6 8-8v-2c0-2.8-2.2-5-5-5zm11 0c-2.8 0-5 2.2-5 5s2.2 5 5 5c.3 0 .6 0 .9-.1-.8 1.8-2.3 3.1-3.9 3.1v2c4.4 0 8-3.6 8-8v-2c0-2.8-2.2-5-5-5z" transform="scale(0.85) translate(1 -1)" />
    </svg>
  );
}
