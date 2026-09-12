"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { steps } from "@/data/site";

const WIPE = [0.76, 0, 0.24, 1] as const;

/**
 * Four steps on the right; on the left a pinned photo that wipes up to the
 * next step's picture as each one reaches the middle of the screen. A copper
 * rule fills down the step list with scroll. Phones get each photo inline.
 */
export function HowWeWork() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length))));
  });

  return (
    <section id="process" className="scroll-mt-24 bg-coal-950">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-32">
        <div className="max-w-3xl">
          <p className="font-display text-xl font-bold uppercase tracking-wide text-copper">
            How we work
          </p>
          <h2 className="mt-1 font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            From first ladder to final walk.
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          <div className="hidden lg:block">
            <div className="sticky top-32 aspect-[4/5] max-h-[calc(100vh-10rem)] w-full overflow-hidden bg-coal-800">
              {steps.map((s, i) => (
                <motion.img
                  key={s.title}
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  initial={false}
                  animate={{
                    clipPath: i <= active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    scale: i === active ? 1 : 1.12,
                  }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: WIPE }}
                  style={{ zIndex: i }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ))}
              <div className="absolute bottom-0 left-0 z-10 overflow-hidden bg-coal-950 px-5 py-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: reduce ? 0 : "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: reduce ? 0 : "-100%" }}
                    transition={{ duration: 0.5, ease: WIPE }}
                    className="block font-display text-6xl font-black leading-none text-copper"
                  >
                    {String(active + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <ol ref={listRef} className="relative">
            <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-[3px] bg-bone/10">
              <motion.div
                style={{ scaleY: reduce ? 1 : scrollYProgress }}
                className="h-full origin-top bg-copper"
              />
            </div>
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="relative pb-16 pl-8 last:pb-0 md:pl-12 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:pb-0"
              >
                <img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  className="mb-6 aspect-[16/10] w-full object-cover lg:hidden"
                />
                <p
                  className={`font-display text-2xl font-extrabold uppercase transition-colors duration-500 ${
                    i <= active ? "text-copper" : "text-bone/30"
                  }`}
                >
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-5xl font-black uppercase leading-none md:text-6xl">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-bone/65">
                  {s.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
