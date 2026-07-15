"use client";

import { useCallback, useRef, useState } from "react";
import { Reveal } from "./Reveal";

/**
 * Before/after comparison slider — drag (or arrow-key) the copper handle to
 * wipe between a storm-worn roof under an overcast sky and the finished
 * Copperline install in full sun. Both sides are the same illustrated house
 * so the wipe reads as a true transformation. Pointer events + clip-path;
 * no external images.
 */
export function BeforeAfter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(58); // % from the left
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section id="work" className="scroll-mt-24">
      <div className="mx-auto max-w-page px-6 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            Our work
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-5xl">
            Drag the line. <span className="copper-clip">See the difference.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative aspect-[16/9] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-ink-950/10 shadow-[0_24px_50px_-30px_rgba(60,42,28,0.4)] md:aspect-[21/9]"
          >
            {/* AFTER — full scene underneath */}
            <div className="absolute inset-0">
              <HouseScene worn={false} />
            </div>
            {/* BEFORE — clipped to the left of the handle */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <HouseScene worn />
            </div>

            {/* Handle */}
            <div
              className="absolute inset-y-0 z-10"
              style={{ left: `${pos}%` }}
              role="slider"
              aria-label="Reveal before and after"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setPos((v) => Math.max(3, v - 4));
                if (e.key === "ArrowRight") setPos((v) => Math.min(97, v + 4));
              }}
            >
              <div className="absolute inset-y-0 -left-px w-0.5 bg-copper shadow-[0_0_18px_rgb(var(--accent)/0.55)]" />
              <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-copper/60 bg-white/95 shadow-[0_4px_20px_rgb(var(--accent)/0.35)] backdrop-blur">
                <svg className="h-4 w-4 text-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-950/70 backdrop-blur">
              Before · storm damage
            </span>
            <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-copper px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              After · Copperline
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-ink-950/45">
            Illustrated recreation of a hail-claim replacement in Maple Grove — 1 day tear-off to finish.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Front elevation of the same house in two states. `worn` renders overcast:
 * faded, patchy shingles, a sagging gutter and missing-tab scars; the after
 * state is full sun, crisp shingles, copper drip-edge and warm windows.
 */
function HouseScene({ worn }: { worn: boolean }) {
  const shingle = worn ? "#8b9096" : "#3a4049";
  const shingleAlt = worn ? "#979ca2" : "#434a54";
  const sky = worn ? "#b4bac0" : "#d9e7ee";

  const rows = 5;
  const cols = 14;
  const roofTop = 96;
  const roofBottom = 210;
  const rowH = (roofBottom - roofTop) / rows;

  return (
    <svg viewBox="0 0 840 360" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      {/* Sky */}
      <rect width="840" height="360" fill={sky} />
      {!worn && (
        <>
          <circle cx="700" cy="64" r="26" fill="rgb(var(--accent-soft) / 0.9)" />
          <circle cx="700" cy="64" r="46" fill="rgb(var(--accent) / 0.18)" />
        </>
      )}
      {worn && (
        <g fill="#9aa1a8">
          <ellipse cx="620" cy="60" rx="90" ry="22" />
          <ellipse cx="700" cy="76" rx="70" ry="18" />
          <ellipse cx="180" cy="48" rx="80" ry="18" />
        </g>
      )}

      {/* Ground */}
      <rect y="300" width="840" height="60" fill={worn ? "#aaa595" : "#c2cdb0"} />

      {/* House body */}
      <rect x="180" y="196" width="480" height="110" fill={worn ? "#d8d1c4" : "#efe8da"} />

      {/* Roof plane (trapezoid) with shingle rows */}
      <g>
        {Array.from({ length: rows }).map((_, r) => {
          const y0 = roofBottom - rowH * r;
          const y1 = y0 - rowH;
          const inset0 = 30 * (r / rows);
          const inset1 = 30 * ((r + 1) / rows);
          const xL0 = 150 + inset0 * 6.4;
          const xR0 = 690 - inset0 * 6.4;
          const xL1 = 150 + inset1 * 6.4;
          const xR1 = 690 - inset1 * 6.4;
          return (
            <g key={r}>
              <polygon
                points={`${xL0},${y0} ${xR0},${y0} ${xR1},${y1} ${xL1},${y1}`}
                fill={r % 2 ? shingle : shingleAlt}
              />
              {Array.from({ length: cols }).map((__, c) => {
                const t = (c + (r % 2 ? 0.5 : 1)) / cols;
                const xTop = xL1 + (xR1 - xL1) * t;
                const xBot = xL0 + (xR0 - xL0) * t;
                return (
                  <line
                    key={c}
                    x1={xBot}
                    y1={y0}
                    x2={xTop}
                    y2={y1}
                    stroke={worn ? "#7d8288" : "#2b3038"}
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })}
        {/* Ridge */}
        <rect x="336" y={roofTop - 7} width="168" height="8" rx="3" fill={worn ? "#a2a7ad" : "#4a525d"} />

        {worn ? (
          <>
            {/* Missing tabs + patch scars */}
            <polygon points="300,168 352,168 344,146 308,146" fill="#6d7278" />
            <polygon points="480,204 540,204 532,182 490,182" fill="#6d7278" />
            <polygon points="396,132 430,132 424,116 402,116" fill="#8a6a45" opacity="0.85" />
            <polygon points="230,196 268,196 262,180 238,180" fill="#8a6a45" opacity="0.7" />
            {/* Water stain */}
            <ellipse cx="420" cy="240" rx="60" ry="10" fill="#8f8578" opacity="0.55" />
            {/* Sagging gutter */}
            <path d="M150 212 Q 340 232 420 224 Q 560 216 690 212" stroke="#8f959c" strokeWidth="7" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Copper drip edge + straight gutter */}
            <line x1="146" y1="211" x2="694" y2="211" stroke="rgb(var(--accent))" strokeWidth="5" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Door + windows */}
      <rect x="390" y="238" width="52" height="68" rx="2" fill="#7c5233" />
      <rect x="396" y="244" width="40" height="56" rx="2" fill={worn ? "#9c7a52" : "#94643f"} />
      {[236, 542].map((x) => (
        <g key={x}>
          <rect x={x} y="230" width="62" height="48" rx="2" fill={worn ? "#c9c2b4" : "#faf6ec"} />
          <rect
            x={x + 5}
            y="235"
            width="52"
            height="38"
            rx="1"
            fill={worn ? "#a8b0b6" : "rgb(var(--accent) / 0.35)"}
          />
          <line x1={x + 31} y1="235" x2={x + 31} y2="273" stroke={worn ? "#c9c2b4" : "#faf6ec"} strokeWidth="3" />
        </g>
      ))}

      {/* Chimney */}
      <rect x="560" y="70" width="36" height="70" fill={worn ? "#a08a7a" : "#a5674f"} />
      <rect x="555" y="62" width="46" height="10" rx="2" fill={worn ? "#b2a99e" : "#b5ada0"} />
      {!worn && <line x1="556" y1="140" x2="600" y2="140" stroke="rgb(var(--accent))" strokeWidth="4" strokeLinecap="round" />}

      {/* Bushes */}
      <ellipse cx="210" cy="302" rx="34" ry="16" fill={worn ? "#9aa284" : "#7f9a6e"} />
      <ellipse cx="640" cy="302" rx="40" ry="18" fill={worn ? "#9aa284" : "#7f9a6e"} />
    </svg>
  );
}
