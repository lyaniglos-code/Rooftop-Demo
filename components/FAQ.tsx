"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * FAQ accordion — height-animated answers, rotating chevron, one item open
 * at a time. Buttons are real buttons with aria-expanded for keyboard users.
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-ink-950/[0.07] bg-paper-200/40">
      <div className="mx-auto grid max-w-page gap-12 px-6 py-24 md:grid-cols-[1fr_1.6fr] md:px-8 md:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            Questions
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-4xl">
            Asked before <span className="copper-clip">every roof.</span>
          </h2>
          <p className="mt-4 text-ink-950/60">
            Anything else on your mind? Call us at{" "}
            <a href="tel:+15550147788" className="font-medium text-copper hover:underline">
              (555) 014-7788
            </a>{" "}
            — a roofer answers, not a phone tree.
          </p>
        </Reveal>

        <RevealGroup className="divide-y divide-ink-950/[0.09]" stagger={0.06}>
          {faqs.map((f, i) => (
            <RevealItem key={i}>
              <div>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-base font-semibold text-ink-950 md:text-lg">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      open === i ? "border-copper/60 text-copper" : "border-ink-950/15 text-ink-950/50"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-ink-950/65 md:text-base">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
