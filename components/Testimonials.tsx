"use client";

import { testimonials } from "@/data/site";
import { RevealGroup, RevealItem } from "./Reveal";

/** Plain quote cards: no carousel to wait on, no stock faces. */
export function Testimonials() {
  return (
    <section className="border-t border-bone/10 bg-coal-950">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            What homeowners
            <br />
            tell us after.
          </h2>
          <p className="flex items-center gap-3 font-semibold text-bone/70">
            <Stars />
            4.9 average from 700+ reviews
          </p>
        </div>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2" stagger={0.1}>
          {testimonials.map((t) => (
            <RevealItem key={t.name} y={40}>
              <figure className="flex h-full flex-col border border-bone/10 bg-coal-900 p-7 transition-colors duration-300 hover:border-copper/50 md:p-9">
                <Stars />
                <blockquote className="mt-5 flex-1 text-xl leading-relaxed text-bone/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-bone/10 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center bg-copper font-display text-xl font-extrabold text-coal-950">
                    {t.name
                      .split(/\s+/)
                      .filter((w) => /^[A-Z]/.test(w))
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="text-sm text-bone/55">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5 text-copper" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
        </svg>
      ))}
    </span>
  );
}
