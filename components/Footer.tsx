"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/data/site";

/** Footer with an oversized wordmark that rises into place as you reach it. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["70%", "0%"]);

  return (
    <footer ref={ref} className="overflow-hidden border-t border-bone/10 bg-coal-900">
      <div className="mx-auto max-w-page px-5 pt-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <p className="font-display text-3xl font-extrabold uppercase">{site.legalName}</p>
            <p className="mt-3 text-sm leading-relaxed text-bone/55">
              Roof replacement, storm repair and metal roofing in {site.serviceArea}.
            </p>
            <p className="mt-3 text-sm text-bone/40">{site.license} · Insured</p>
          </div>
          <FooterCol title="Explore">
            <li><a href="#services" className="hover:text-copper">Services</a></li>
            <li><a href="#process" className="hover:text-copper">How we work</a></li>
            <li><a href="#work" className="hover:text-copper">Recent work</a></li>
            <li><a href="#faq" className="hover:text-copper">FAQ</a></li>
          </FooterCol>
          <FooterCol title="Contact">
            <li><a href={site.phoneHref} className="hover:text-copper">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-copper">{site.email}</a></li>
            <li>{site.city}</li>
          </FooterCol>
          <FooterCol title="Hours">
            <li>Mon–Fri, 7am–6pm</li>
            <li>Sat, 8am–2pm</li>
            <li className="text-copper">Storm line 24/7</li>
          </FooterCol>
        </div>

        <p className="mt-12 border-t border-bone/10 pt-6 text-xs leading-relaxed text-bone/40">
          © {new Date().getFullYear()} {site.legalName} is a fictional company.
          This site is a design demo: names, numbers and reviews are invented,
          and the photos are stock images from Unsplash.
        </p>
      </div>

      <div aria-hidden="true" className="mx-auto max-w-page px-5 md:px-8">
        <motion.p
          style={reduce ? undefined : { y }}
          className="select-none whitespace-nowrap font-display text-[19vw] font-black uppercase leading-[0.8] text-coal-800 lg:text-[15rem]"
        >
          Copperline
        </motion.p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-lg font-bold uppercase tracking-wide text-bone/80">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-bone/55">{children}</ul>
    </div>
  );
}
