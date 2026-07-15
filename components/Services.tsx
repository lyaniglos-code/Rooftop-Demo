"use client";

import { services } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

/**
 * Services grid — glass cards with a copper glow that follows hover,
 * lift-on-hover, and staggered scroll reveals.
 */
export function Services() {
  return (
    <section id="services" className="scroll-mt-24">
      <div className="mx-auto max-w-page px-6 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            What we do
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-5xl">
            Everything overhead,{" "}
            <span className="copper-clip">handled by one crew.</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <RevealItem key={s.title}>
              <article className="group glass relative h-full overflow-hidden rounded-2xl p-7 transition-transform duration-500 ease-smooth hover:-translate-y-1.5">
                {/* Copper wash that breathes in on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-copper/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper/10 text-copper transition-colors duration-500 group-hover:bg-copper/20">
                  <ServiceIcon name={s.icon} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-950/65">
                  {s.copy}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-copper opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Learn more
                  <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M13 2L4.5 13H11l-1.5 9L18 10.5h-6.5L13 2z" />
        </svg>
      );
    case "metal":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8M16 7h5v5" />
        </svg>
      );
    case "gutter":
      return (
        <svg {...common}>
          <path d="M4 4h16M6 4v6a6 6 0 0012 0V4M12 16v6M9 22h6" />
        </svg>
      );
    case "sky":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9l6 6M15 9v6H9" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.5 2.5L16 9.5" />
        </svg>
      );
  }
}
