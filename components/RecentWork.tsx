"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { projects } from "@/data/site";

type Project = (typeof projects)[number];

/**
 * Three finished jobs. Each photo opens out of a smaller frame and settles
 * from a push-in as it scrolls up the screen.
 */
export function RecentWork() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-bone/10 bg-coal-900">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-display text-xl font-bold uppercase tracking-wide text-copper">
              Recent work
            </p>
            <h2 className="mt-1 font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              Roofs we put on
              <br />
              this year.
            </h2>
          </div>
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 self-start font-bold uppercase tracking-wide text-copper md:self-auto"
          >
            Get on the schedule
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
          {projects.map((p, i) => (
            <WorkTile key={p.title} project={p} tall={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkTile({ project, tall }: { project: Project; tall: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);

  return (
    <figure ref={ref} className={tall ? "md:row-span-2" : ""}>
      <motion.div
        style={reduce ? undefined : { clipPath }}
        className={`group relative overflow-hidden bg-coal-800 ${
          tall ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[16/10]"
        }`}
      >
        <motion.img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { scale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coal-950/95 via-coal-950/60 to-transparent p-5 pt-20 md:p-7 md:pt-24">
          <p className="font-display text-3xl font-extrabold uppercase leading-none md:text-4xl">
            {project.title}
          </p>
          <p className="mt-2 text-sm text-bone/70">
            <span className="font-semibold text-copper">{project.place}</span>
            {"  ·  "}
            {project.scope}
          </p>
        </div>
      </motion.div>
    </figure>
  );
}
