"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { services } from "@/data/site";

/**
 * On desktop the section pins and the service cards travel sideways as you
 * scroll down, with a copper bar tracking how far along you are. The section
 * is exactly as tall as the sideways distance, so the strip ends as the pin
 * releases. Phones and reduced motion get a plain stacked list.
 */
export function Services() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      setDistance(wide ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pinned = distance > 0 && !reduce;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (p) => -p * distance);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-24 bg-coal-900"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
        <div className="mx-auto flex w-full max-w-page items-end justify-between gap-8 px-5 pt-24 md:px-8 lg:pt-24">
          <div>
            <p className="font-display text-xl font-bold uppercase tracking-wide text-copper">
              Services
            </p>
            <h2 className="mt-1 font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              Everything on
              <br />
              top of the house.
            </h2>
          </div>
          <p className="hidden max-w-xs pb-2 text-bone/60 md:block">
            One crew handles all of it, from the first inspection to the last
            gutter bracket.
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className="mt-10 flex flex-col gap-5 px-5 pb-24 md:px-8 lg:w-max lg:flex-row lg:gap-6 lg:pb-0 lg:pl-[max(2rem,calc((100vw_-_1280px)/2_+_2rem))] lg:pr-[max(2rem,calc((100vw_-_1280px)/2_+_2rem))]"
        >
          {services.map((s, i) => (
            <article
              key={s.title}
              className="group overflow-hidden border border-bone/10 bg-coal-800 lg:w-[380px] lg:shrink-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
                <span className="absolute left-0 top-0 bg-coal-950 px-3 py-1.5 font-display text-2xl font-extrabold text-copper">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl font-extrabold uppercase leading-none">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-bone/65">{s.copy}</p>
              </div>
            </article>
          ))}
        </motion.div>

        {pinned && (
          <div className="mx-auto mt-10 w-full max-w-page px-8">
            <div className="h-[3px] bg-bone/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full origin-left bg-copper"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
