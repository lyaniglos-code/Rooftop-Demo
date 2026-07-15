"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { buildStages } from "@/data/site";

/**
 * The centerpiece: a pinned scroll scene that builds a roof layer by layer.
 *
 * The section is 520vh tall; a 100vh stage stays stuck while scroll progress
 * (0→1) drives everything: an isometric house drawn programmatically in SVG,
 * a "camera" (translate+scale on the SVG scene) that holds an angle over the
 * house and glides to whichever part of the roof is being worked on, and one
 * info card per stage that transforms in and out (blur, tilt, rise).
 *
 * Stages: decking → underlayment → flashing & drip edge → shingles → ridge.
 * All geometry comes from one isometric projection helper, so the whole house
 * is tweakable from a handful of constants. Reduced motion renders the
 * finished house with the stage notes as a static list.
 */

/* ---------------------------------------------------------------- geometry */

const CX = 448;
const CY = 253;
const iso = (x: number, y: number, z: number): [number, number] => [
  +(CX + (x - y) * 0.866).toFixed(1),
  +(CY + (x + y) * 0.5 - z).toFixed(1),
];

const W = 420; // house width (ridge direction)
const D = 300; // house depth
const H = 170; // wall height
const RISE = 130; // ridge rise above walls
const OV = 30; // roof overhang
const SLOPE = RISE / (D / 2);
const RIDGE_Y = D / 2;
const EAVE_Y = D + OV;
/** Height of the front roof plane at depth y (eave y=330 → ridge y=150). */
const zOf = (y: number) => H + (D - y) * SLOPE;

const pts = (...ps: [number, number][]) => ps.map((p) => p.join(",")).join(" ");

/** Quad on the front roof plane between depths y0 (lower) and y1 (upper). */
const roofQuad = (y0: number, y1: number, x0 = -OV, x1 = W + OV) =>
  pts(
    iso(x0, y0, zOf(y0)),
    iso(x1, y0, zOf(y0)),
    iso(x1, y1, zOf(y1)),
    iso(x0, y1, zOf(y1))
  );

/** Rect on the front wall plane (y = D), in x/z coordinates. */
const frontRect = (x0: number, x1: number, z0: number, z1: number) =>
  pts(iso(x0, D, z0), iso(x1, D, z0), iso(x1, D, z1), iso(x0, D, z1));

/** Rect on the right wall plane (x = W), in y/z coordinates. */
const rightRect = (y0: number, y1: number, z0: number, z1: number) =>
  pts(iso(W, y0, z0), iso(W, y1, z0), iso(W, y1, z1), iso(W, y0, z1));

// Walls & gable
const FRONT_WALL = pts(iso(0, D, 0), iso(W, D, 0), iso(W, D, H), iso(0, D, H));
const RIGHT_WALL = pts(iso(W, 0, 0), iso(W, D, 0), iso(W, D, H), iso(W, 0, H));
const GABLE = pts(iso(W, 0, H), iso(W, D, H), iso(W, RIDGE_Y, H + RISE));

// Finished-roof ghost outline (dashed) — makes the missing roof read as intent
const ROOF_OUTLINE = roofQuad(EAVE_Y, RIDGE_Y);

// Ridge line endpoints
const R1 = iso(-OV, RIDGE_Y, H + RISE);
const R2 = iso(W + OV, RIDGE_Y, H + RISE);

// Eave line endpoints
const E1 = iso(-OV, EAVE_Y, zOf(EAVE_Y));
const E2 = iso(W + OV, EAVE_Y, zOf(EAVE_Y));

// Chimney straddling the ridge
const CH = { x0: 300, x1: 360, y0: 130, y1: 172, zBase: 282, zTop: 372 };
const CHIMNEY_FRONT = pts(
  iso(CH.x0, CH.y1, CH.zBase),
  iso(CH.x1, CH.y1, CH.zBase),
  iso(CH.x1, CH.y1, CH.zTop),
  iso(CH.x0, CH.y1, CH.zTop)
);
const CHIMNEY_RIGHT = pts(
  iso(CH.x1, CH.y0, CH.zBase),
  iso(CH.x1, CH.y1, CH.zBase),
  iso(CH.x1, CH.y1, CH.zTop),
  iso(CH.x1, CH.y0, CH.zTop)
);
const CHIMNEY_TOP = pts(
  iso(CH.x0 - 5, CH.y0 - 5, CH.zTop),
  iso(CH.x1 + 5, CH.y0 - 5, CH.zTop),
  iso(CH.x1 + 5, CH.y1 + 5, CH.zTop),
  iso(CH.x0 - 5, CH.y1 + 5, CH.zTop)
);

// Rafters: nine lines up the slope + the ridge beam
const RAFTER_XS = Array.from({ length: 9 }, (_, k) => -OV + (k * (W + 2 * OV)) / 8);

// Deck courses (6), underlayment courses (4), shingle grid (8 × 10)
const DECK_N = 6;
const UNDER_N = 4;
const SH_ROWS = 8;
const SH_COLS = 10;
const FIELD = EAVE_Y - RIDGE_Y; // 180
const SHINGLE_TONES = ["#3a4049", "#434a54", "#333941"];

// Ridge caps (12 segments straddling the ridge)
const CAP_N = 12;

/* ------------------------------------------------------- animated elements */

const EASE = [0.22, 1, 0.36, 1] as const;

function Rafter({
  p,
  x,
  win,
}: {
  p: MotionValue<number>;
  x: number;
  win: [number, number];
}) {
  const pathLength = useTransform(p, win, [0, 1]);
  const [ex, ey] = iso(x, EAVE_Y, zOf(EAVE_Y));
  const [rx, ry] = iso(x, RIDGE_Y, H + RISE);
  return (
    <motion.line
      x1={ex}
      y1={ey}
      x2={rx}
      y2={ry}
      stroke="#a5794a"
      strokeWidth={5}
      strokeLinecap="round"
      style={{ pathLength }}
    />
  );
}

function Course({
  p,
  win,
  points,
  fill,
  fromX = 26,
  stroke,
}: {
  p: MotionValue<number>;
  win: [number, number];
  points: string;
  fill: string;
  fromX?: number;
  stroke?: string;
}) {
  const opacity = useTransform(p, win, [0, 1]);
  const x = useTransform(p, win, [fromX, 0]);
  return (
    <motion.polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? 1 : 0}
      style={{ opacity, x }}
    />
  );
}

function Tab({
  p,
  win,
  points,
  fill,
}: {
  p: MotionValue<number>;
  win: [number, number];
  points: string;
  fill: string;
}) {
  const opacity = useTransform(p, win, [0, 1]);
  const y = useTransform(p, win, [-13, 0]);
  return <motion.polygon points={points} fill={fill} style={{ opacity, y }} />;
}

function DrawnPath({
  p,
  win,
  d,
  stroke,
  width,
}: {
  p: MotionValue<number>;
  win: [number, number];
  d: string;
  stroke: string;
  width: number;
}) {
  const pathLength = useTransform(p, win, [0, 1]);
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      style={{ pathLength }}
    />
  );
}

/* ------------------------------------------------------------- stage cards */

const STAGE_WINDOWS: [number, number][] = [
  [0.06, 0.24],
  [0.24, 0.42],
  [0.42, 0.58],
  [0.58, 0.8],
  [0.8, 0.94],
];

function StageCard({
  p,
  index,
}: {
  p: MotionValue<number>;
  index: number;
}) {
  const stage = buildStages[index];
  const [a, b] = STAGE_WINDOWS[index];
  const fadeIn = 0.045;

  const opacity = useTransform(p, [a, a + fadeIn, b - fadeIn, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, a + fadeIn, b - fadeIn, b], [64, 0, 0, -64]);
  const rotateX = useTransform(p, [a, a + fadeIn, b - fadeIn, b], [12, 0, 0, -12]);
  const scale = useTransform(p, [a, a + fadeIn, b - fadeIn, b], [0.94, 1, 1, 0.97]);
  const blurPx = useTransform(p, [a, a + fadeIn, b - fadeIn, b], [10, 0, 0, 10]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const barW = useTransform(p, [a + fadeIn, b - fadeIn], ["0%", "100%"]);

  return (
    <motion.div
      style={{ opacity, y, rotateX, scale, filter, transformPerspective: 900 }}
      className="glass absolute inset-x-0 rounded-2xl p-5 md:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">
        {stage.kicker}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold text-ink-950 md:text-[1.7rem] md:leading-snug">
        {stage.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-950/70 md:text-base">
        {stage.copy}
      </p>
      <div className="mt-5 flex items-baseline gap-3 border-t border-ink-950/10 pt-4">
        <span className="copper-clip font-display text-4xl font-bold">
          {stage.stat}
        </span>
        <span className="text-xs uppercase tracking-wider text-ink-950/50">
          {stage.statLabel}
        </span>
      </div>
      {/* Stage progress underline */}
      <div className="mt-4 h-0.5 w-full overflow-hidden rounded bg-ink-950/10">
        <motion.div style={{ width: barW }} className="h-full bg-copper/80" />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- the scene */

function HouseScene({ p }: { p: MotionValue<number> }) {
  // Camera: focus point + zoom per stage; tx/ty keep the focus centered.
  // Base zoom sits above 1 so the house fills the frame as the centerpiece.
  const KF = [0, 0.1, 0.26, 0.44, 0.6, 0.82, 0.94, 1];
  const fx = useTransform(p, KF, [470, 430, 430, 310, 430, 500, 470, 470]);
  const fy = useTransform(p, KF, [310, 260, 260, 385, 260, 150, 310, 310]);
  const s = useTransform(p, KF, [1.12, 1.28, 1.34, 1.56, 1.38, 1.6, 1.18, 1.18]);
  const tx = useTransform([s, fx], ([sv, f]: number[]) => 500 - sv * f);
  const ty = useTransform([s, fy], ([sv, f]: number[]) => 320 - sv * f);

  // Framer-motion ignores a raw `transform` style on SVG elements, so the
  // camera writes the transform attribute itself, driven by scroll progress.
  const cameraRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const apply = () =>
      cameraRef.current?.setAttribute(
        "transform",
        `translate(${tx.get()} ${ty.get()}) scale(${s.get()})`
      );
    apply();
    return p.on("change", apply);
  }, [p, tx, ty, s]);

  // Ghost outline of the finished roof fades as the real one appears
  const ghostOpacity = useTransform(p, [0.05, 0.6], [0.5, 0]);
  // Warm completion glow + windows lighting up
  const glow = useTransform(p, [0.88, 0.96], [0, 1]);
  const windowGlow = useTransform(p, [0.9, 0.96], [0, 0.95]);

  // Deck courses, eave upward
  const deck = Array.from({ length: DECK_N }, (_, i) => {
    const y0 = EAVE_Y - (FIELD / DECK_N) * i;
    const y1 = y0 - FIELD / DECK_N;
    return {
      points: roofQuad(y0, y1 + 1.5),
      fill: i % 2 ? "#b78c58" : "#c39a67",
      win: [0.115 + i * 0.017, 0.15 + i * 0.017] as [number, number],
    };
  });

  // Underlayment courses
  const under = Array.from({ length: UNDER_N }, (_, i) => {
    const y0 = EAVE_Y - (FIELD / UNDER_N) * i;
    const y1 = y0 - FIELD / UNDER_N;
    return {
      points: roofQuad(y0, y1 + 1),
      fill: i % 2 ? "#67727f" : "#75808f",
      win: [0.26 + i * 0.032, 0.31 + i * 0.032] as [number, number],
    };
  });

  // Shingle grid, staggered like a real course layout
  const tabs: { points: string; fill: string; win: [number, number] }[] = [];
  const rowH = FIELD / SH_ROWS;
  const colW = (W + 2 * OV) / SH_COLS;
  for (let r = 0; r < SH_ROWS; r++) {
    const y0 = EAVE_Y - rowH * r;
    const y1 = y0 - rowH;
    const offset = r % 2 ? -colW / 2 : 0;
    const cols = r % 2 ? SH_COLS + 1 : SH_COLS;
    for (let c = 0; c < cols; c++) {
      const x0 = Math.max(-OV, -OV + offset + colW * c);
      const x1 = Math.min(W + OV, -OV + offset + colW * (c + 1));
      if (x1 - x0 < 4) continue;
      const start = 0.6 + r * 0.021 + c * 0.0016;
      tabs.push({
        points: roofQuad(y0, y1 + 2, x0 + 1.2, x1 - 1.2),
        fill: SHINGLE_TONES[(r * 7 + c * 3) % 3],
        win: [start, start + 0.02],
      });
    }
  }

  // Ridge caps
  const caps = Array.from({ length: CAP_N }, (_, i) => {
    const x0 = -OV + ((W + 2 * OV) / CAP_N) * i;
    const x1 = x0 + (W + 2 * OV) / CAP_N;
    return {
      points: roofQuad(RIDGE_Y + 16, RIDGE_Y, x0 + 1, x1 - 1),
      win: [0.825 + i * 0.006, 0.845 + i * 0.006] as [number, number],
    };
  });

  const eaveD = `M ${E1[0]} ${E1[1]} L ${E2[0]} ${E2[1]}`;
  const rakeLeftD = `M ${E1[0]} ${E1[1]} L ${R1[0]} ${R1[1]}`;
  const rakeRightD = `M ${E2[0]} ${E2[1]} L ${R2[0]} ${R2[1]}`;
  const ridgeD = `M ${R1[0]} ${R1[1]} L ${R2[0]} ${R2[1]}`;
  const flashD = `M ${iso(CH.x0 - 4, CH.y1 + 3, CH.zBase + 10).join(" ")} L ${iso(
    CH.x1 + 4,
    CH.y1 + 3,
    CH.zBase + 10
  ).join(" ")}`;

  return (
    <svg
      viewBox="0 0 1000 640"
      className="h-full w-full"
      aria-label="Animated cutaway of a roof being built in five stages"
      role="img"
    >
      <defs>
        <linearGradient id="copper-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent-soft))" />
          <stop offset="55%" stopColor="rgb(var(--accent))" />
          <stop offset="100%" stopColor="rgb(var(--accent-deep))" />
        </linearGradient>
        <radialGradient id="scene-glow">
          <stop offset="0%" stopColor="rgb(var(--accent) / 0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="ground-shadow">
          <stop offset="0%" stopColor="rgba(70,55,40,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <g ref={cameraRef}>
        {/* Completion glow behind everything */}
        <motion.ellipse
          cx={470}
          cy={280}
          rx={430}
          ry={300}
          fill="url(#scene-glow)"
          style={{ opacity: glow }}
        />

        {/* Ground */}
        <ellipse cx={470} cy={575} rx={340} ry={48} fill="url(#ground-shadow)" />

        {/* Walls */}
        <polygon points={RIGHT_WALL} fill="#cfc5b4" />
        <polygon points={FRONT_WALL} fill="#ece5d8" />
        <polygon points={GABLE} fill="#ddd4c3" />

        {/* Door + windows on the front wall */}
        <polygon points={frontRect(58, 108, 0, 96)} fill="#7c5233" />
        <polygon points={frontRect(64, 102, 0, 90)} fill="#94643f" />
        <motion.polygon
          points={frontRect(148, 214, 36, 96)}
          fill="rgb(var(--accent-soft))"
          style={{ opacity: windowGlow }}
        />
        <polygon
          points={frontRect(148, 214, 36, 96)}
          fill="#4a5661"
          opacity={0.92}
        />
        <motion.polygon
          points={frontRect(254, 320, 36, 96)}
          fill="rgb(var(--accent-soft))"
          style={{ opacity: windowGlow }}
        />
        <polygon
          points={frontRect(254, 320, 36, 96)}
          fill="#4a5661"
          opacity={0.92}
        />
        {/* Lit panes on top so the glow reads through mullions */}
        <motion.g style={{ opacity: windowGlow }}>
          <polygon points={frontRect(152, 178, 40, 92)} fill="rgb(var(--accent-soft) / 0.85)" />
          <polygon points={frontRect(184, 210, 40, 92)} fill="rgb(var(--accent-soft) / 0.7)" />
          <polygon points={frontRect(258, 284, 40, 92)} fill="rgb(var(--accent-soft) / 0.7)" />
          <polygon points={frontRect(290, 316, 40, 92)} fill="rgb(var(--accent-soft) / 0.85)" />
        </motion.g>
        {/* Gable-end window */}
        <polygon points={rightRect(96, 176, 44, 104)} fill="#4a5661" />

        {/* Ghost of the finished roof */}
        <motion.g style={{ opacity: ghostOpacity }}>
          <polygon
            points={ROOF_OUTLINE}
            fill="none"
            stroke="rgb(var(--sky) / 0.6)"
            strokeWidth={1.5}
            strokeDasharray="6 8"
          />
          <path
            d={ridgeD}
            stroke="rgb(var(--sky) / 0.6)"
            strokeWidth={1.5}
            strokeDasharray="6 8"
            fill="none"
          />
        </motion.g>

        {/* STAGE 1 — rafters, then decking */}
        <DrawnPath p={p} win={[0.065, 0.105]} d={ridgeD} stroke="#a5794a" width={6} />
        {RAFTER_XS.map((x, i) => (
          <Rafter key={x} p={p} x={x} win={[0.07 + i * 0.005, 0.115 + i * 0.005]} />
        ))}
        {deck.map((c, i) => (
          <Course key={`d${i}`} p={p} win={c.win} points={c.points} fill={c.fill} />
        ))}

        {/* STAGE 2 — underlayment courses roll across */}
        {under.map((c, i) => (
          <Course
            key={`u${i}`}
            p={p}
            win={c.win}
            points={c.points}
            fill={c.fill}
            fromX={i % 2 ? -30 : 30}
          />
        ))}

        {/* STAGE 3 — ice & water shield, then metal edges */}
        <Course
          p={p}
          win={[0.43, 0.47]}
          points={roofQuad(EAVE_Y, EAVE_Y - FIELD / 4)}
          fill="#3e454f"
          fromX={20}
        />
        <DrawnPath p={p} win={[0.455, 0.51]} d={eaveD} stroke="url(#copper-metal)" width={5} />
        <DrawnPath p={p} win={[0.49, 0.535]} d={rakeLeftD} stroke="url(#copper-metal)" width={3.5} />
        <DrawnPath p={p} win={[0.49, 0.535]} d={rakeRightD} stroke="url(#copper-metal)" width={3.5} />

        {/* STAGE 4 — shingles cascade up the field */}
        {tabs.map((t, i) => (
          <Tab key={`t${i}`} p={p} win={t.win} points={t.points} fill={t.fill} />
        ))}

        {/* STAGE 5 — ridge vent + caps */}
        <DrawnPath p={p} win={[0.805, 0.835]} d={ridgeD} stroke="#59616c" width={7} />
        {caps.map((c, i) => (
          <Course
            key={`c${i}`}
            p={p}
            win={c.win}
            points={c.points}
            fill="#4a525d"
            fromX={0}
            stroke="#2f353d"
          />
        ))}

        {/* Chimney (above the roof planes) + stage-3 flashing glint */}
        <polygon points={CHIMNEY_RIGHT} fill="#8f5540" />
        <polygon points={CHIMNEY_FRONT} fill="#a5674f" />
        <polygon points={CHIMNEY_TOP} fill="#b5ada0" />
        <DrawnPath p={p} win={[0.52, 0.565]} d={flashD} stroke="url(#copper-metal)" width={4} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ export */

export function RoofBuilder() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Bookend copy
  const introOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const introY = useTransform(p, [0, 0.05], [0, -30]);
  const outroOpacity = useTransform(p, [0.94, 0.985], [0, 1]);
  const outroY = useTransform(p, [0.94, 0.985], [24, 0]);

  if (reduce) {
    return (
      <section id="build" className="mx-auto max-w-page px-6 py-24 md:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink-950">
          Anatomy of a Copperline roof
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {buildStages.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">
                {s.kicker}
              </p>
              <h3 className="mt-2 font-display text-xl text-ink-950">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-950/70">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="build" ref={containerRef} className="relative h-[520vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Intro bookend */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute inset-x-0 top-[12vh] z-20 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            Scroll to build
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightest text-ink-950 md:text-6xl">
            Anatomy of a <span className="copper-clip">Copperline</span> roof
          </h2>
          <p className="mx-auto mt-4 max-w-xl px-6 text-ink-950/60">
            Five layers stand between your family and the sky. Watch every one
            of them go on — in order, to spec.
          </p>
        </motion.div>

        {/* Outro bookend */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY }}
          className="pointer-events-none absolute inset-x-0 top-[12vh] z-20 text-center"
        >
          <h2 className="font-display text-4xl font-semibold tracking-tightest text-ink-950 md:text-6xl">
            Built once. <span className="copper-clip">Built right.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md px-6 text-ink-950/60">
            Every layer photographed and signed off before we call it done.
          </p>
        </motion.div>

        {/* Scene — the house is the centerpiece; cards ride alongside */}
        <div className="relative mx-auto grid h-full w-full max-w-[1560px] flex-1 grid-cols-1 items-center gap-4 px-4 md:grid-cols-[1.9fr_1fr] md:px-8">
          <div className="relative h-[42vh] md:h-[86vh]">
            <HouseScene p={p} />
          </div>

          {/* Stage cards — desktop: right column; mobile: bottom overlay */}
          <div className="pointer-events-none relative z-10 mx-auto -mt-6 w-full max-w-[420px] md:mt-0" style={{ minHeight: "300px" }}>
            {buildStages.map((_, i) => (
              <StageCard key={i} p={p} index={i} />
            ))}
          </div>
        </div>

        {/* Stage rail */}
        <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex lg:left-10">
          {buildStages.map((s, i) => (
            <RailDot key={s.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The finished house at rest — the last frame of the build scene, reusable
 * outside the pinned section (the hero features it). Static progress, so
 * every layer is complete and the windows glow.
 */
export function FinishedHouse({ className }: { className?: string }) {
  const p = useMotionValue(0.99);
  return (
    <div className={className} aria-hidden="true">
      <HouseScene p={p} />
    </div>
  );
}

function RailDot({ p, index }: { p: MotionValue<number>; index: number }) {
  const [a, b] = STAGE_WINDOWS[index];
  const scale = useTransform(p, [a - 0.02, a + 0.02, b - 0.02, b + 0.02], [1, 1.9, 1.9, 1]);
  const opacity = useTransform(p, [a - 0.02, a + 0.02, b - 0.02, b + 0.02], [0.3, 1, 1, 0.3]);
  return (
    <motion.span
      style={{ scale, opacity }}
      className="block h-2 w-2 rounded-full bg-copper"
    />
  );
}
