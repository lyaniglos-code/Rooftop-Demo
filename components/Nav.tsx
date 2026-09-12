"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { site } from "@/data/site";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How we work" },
  { href: "#work", label: "Recent work" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Copper storm-line strip over a nav that turns solid once you leave the hero
 * photo. Mobile gets a full-screen sheet.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 40)), [scrollY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-copper text-coal-950">
        <div className="mx-auto flex h-9 max-w-page items-center justify-center px-5 text-[13px] font-semibold md:justify-between md:px-8">
          <p>Storm damage? We tarp within 24 hours.</p>
          <a href={site.phoneHref} className="hidden underline-offset-4 hover:underline md:inline">
            24/7 storm line {site.phone}
          </a>
        </div>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled || open
            ? "border-bone/10 bg-coal-950/95 backdrop-blur"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-5 md:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[1.7rem] font-extrabold uppercase leading-none tracking-wide">
              Copperline
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-bone/70 transition-colors hover:text-bone"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#quote"
              className="bg-copper px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-coal-950 transition-colors hover:bg-bone"
            >
              Free inspection
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3.5 w-6">
              <motion.span
                animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="absolute top-0 block h-0.5 w-full bg-bone"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="absolute top-[7px] block h-0.5 w-full bg-bone"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="absolute top-[14px] block h-0.5 w-full bg-bone"
              />
            </span>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            // Negative z inside the header's stacking context: under the two
            // bars, over the page.
            className="fixed inset-0 -z-10 bg-coal-950 lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              className="flex h-full flex-col justify-center gap-4 px-6 pt-20"
            >
              {[...LINKS, { href: "#quote", label: "Free inspection" }].map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="font-display text-5xl font-black uppercase text-bone"
                >
                  {l.label}
                </motion.a>
              ))}
              <a href={site.phoneHref} className="mt-6 text-lg font-semibold text-copper">
                Call {site.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" fill="rgb(var(--copper))" />
      <path
        d="M6 21 L16 11 L26 21"
        fill="none"
        stroke="#0d0e0f"
        strokeWidth="3.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
