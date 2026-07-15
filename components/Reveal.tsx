"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal — ported from the YANIGLOS portfolio.
 * Smooth, engineered easing; collapses to a plain fade under reduced motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
