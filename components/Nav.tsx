"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { site } from "@/data/site";

const LINKS = [
  { href: "#build", label: "The Build" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Our Work" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Scroll-aware glass nav: transparent over the hero, frosted once you travel.
 * Mobile gets a full-screen sheet with staggered link reveals.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 24)), [scrollY]);

  // Lock body scroll while the sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
        scrolled
          ? "border-b border-ink-950/[0.08] bg-paper-100/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-6 md:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight text-ink-950">
            {site.name}
            <span className="text-copper">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-950/60 transition-colors duration-300 hover:text-ink-950"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            className="rounded-full bg-copper px-5 py-2 text-sm font-semibold text-white transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
          >
            Free inspection
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-3.5 w-6">
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="absolute top-0 block h-0.5 w-full bg-ink-950"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="absolute top-[7px] block h-0.5 w-full bg-ink-950"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="absolute top-[14px] block h-0.5 w-full bg-ink-950"
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-paper-100/95 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              className="flex h-full flex-col items-center justify-center gap-7"
            >
              {[...LINKS, { href: "#quote", label: "Free inspection" }].map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="font-display text-3xl font-semibold text-ink-950/85"
                >
                  {l.label}
                </motion.a>
              ))}
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
      <path
        d="M4 18 L16 7 L28 18"
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 22 L16 14.5 L24 22"
        fill="none"
        stroke="rgba(28,26,23,0.55)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 26 L16 22 L20 26"
        fill="none"
        stroke="rgba(28,26,23,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
