"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { processSteps } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

/**
 * Process timeline — a copper progress spine that draws itself as you scroll
 * through the steps, with numbered nodes lighting up as the line passes.
 */
export function Process() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  return (
    <section id="process" className="scroll-mt-24 border-t border-ink-950/[0.07] bg-paper-200/40">
      <div className="mx-auto max-w-page px-6 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-5xl">
            Four steps. <span className="copper-clip">Zero surprises.</span>
          </h2>
        </Reveal>

        <ol ref={listRef} className="relative mt-16 space-y-14 md:space-y-20">
          {/* Spine */}
          <div aria-hidden="true" className="absolute bottom-6 left-[21px] top-2 w-px bg-ink-950/10 md:left-1/2" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : lineScale }}
            className="absolute bottom-6 left-[21px] top-2 w-px origin-top bg-gradient-to-b from-copper-soft via-copper to-copper-deep md:left-1/2"
          />

          {processSteps.map((step, i) => (
            <li key={step.title} className="relative">
              <RevealGroup className={`flex items-start gap-6 md:gap-0 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                {/* Node */}
                <RevealItem className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-copper/50 bg-paper-50 font-display text-sm font-bold text-copper shadow-[0_0_20px_rgb(var(--accent)/0.25)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </RevealItem>
                {/* Card */}
                <RevealItem className={`w-full md:w-[calc(50%-3.5rem)] ${i % 2 ? "md:mr-auto" : "md:ml-auto"}`}>
                  <div className="glass rounded-2xl p-6 md:p-7">
                    <h3 className="font-display text-xl font-semibold text-ink-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-950/65">
                      {step.copy}
                    </p>
                  </div>
                </RevealItem>
              </RevealGroup>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
