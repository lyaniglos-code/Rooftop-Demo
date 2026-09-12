"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs, site } from "@/data/site";
import { Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Accordion, one answer open at a time. Real buttons with aria-expanded. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-bone/10 bg-coal-900">
      <div className="mx-auto grid max-w-page gap-12 px-5 py-24 md:grid-cols-[1fr_1.5fr] md:px-8 md:py-32">
        <Reveal>
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl">
            Questions we get a lot.
          </h2>
          <p className="mt-5 max-w-sm text-bone/65">
            Something else on your mind? Call{" "}
            <a href={site.phoneHref} className="font-semibold text-copper hover:underline">
              {site.phone}
            </a>
            . A roofer picks up.
          </p>
        </Reveal>

        <div className="border-t border-bone/10">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-bone/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-semibold md:text-xl">{f.q}</span>
                <span
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-300 ${
                    open === i ? "bg-copper text-coal-950" : "bg-coal-800 text-bone"
                  }`}
                >
                  <span className="absolute h-0.5 w-3.5 bg-current" />
                  <motion.span
                    animate={{ rotate: open === i ? 90 : 0, opacity: open === i ? 0 : 1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute h-3.5 w-0.5 bg-current"
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 leading-relaxed text-bone/65">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
