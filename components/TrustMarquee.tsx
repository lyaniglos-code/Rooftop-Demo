"use client";

import { trustedBy } from "@/data/site";

/**
 * Infinite logo/name marquee — the "trusted by" strip every business site
 * wants. Pure CSS animation (pauses under reduced motion via the global
 * media query), duplicated content for the seamless loop, edge-faded.
 */
export function TrustMarquee() {
  const row = [...trustedBy, ...trustedBy];
  return (
    <section aria-label="Trusted by" className="relative border-y border-ink-950/[0.07] bg-paper-200/60 py-6">
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center gap-14 pr-14">
          {row.map((name, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-ink-950/40"
            >
              <span className="h-1 w-1 rounded-full bg-copper/50" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
