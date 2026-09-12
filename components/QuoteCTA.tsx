"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const ISSUES = ["Leak or storm damage", "Old roof", "New build", "Just want a look"];

/**
 * Inspection form over a slow-drifting roof photo. Demo only: validation and
 * the success state are real, but nothing is sent anywhere.
 */
export function QuoteCTA() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const [sent, setSent] = useState(false);
  const [fields, setFields] = useState({ name: "", phone: "", address: "", issue: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: fields.name.trim().length < 2 ? "Tell us your name" : "",
    phone: !/^[\d\s()+-]{7,}$/.test(fields.phone) ? "Enter a phone number we can call" : "",
    address: fields.address.trim().length < 5 ? "Enter the property address" : "",
  };
  const invalid = Object.values(errors).some(Boolean);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });
    if (!invalid) setSent(true);
  };

  return (
    <section id="quote" ref={ref} className="relative scroll-mt-24 overflow-hidden">
      <motion.img
        src="/images/work-metal-ridge.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={reduce ? undefined : { y: bgY, scale: 1.25 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-coal-950/80" />

      <div className="relative mx-auto grid max-w-page items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <div>
          <p className="font-display text-xl font-bold uppercase tracking-wide text-copper">
            Free inspection
          </p>
          <h2 className="mt-1 font-display text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            Find out what your roof needs.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/75">
            About 40 minutes on the roof, photos of everything we find, and a
            fixed price that holds for 90 days.
          </p>
          <ul className="mt-8 space-y-3 font-medium text-bone/80">
            <li className="flex items-center gap-3"><Tick /> Appointments this week</li>
            <li className="flex items-center gap-3"><Tick /> Insurance paperwork handled</li>
            <li className="flex items-center gap-3">
              <Tick /> Or call{" "}
              <a href={site.phoneHref} className="font-bold text-copper hover:underline">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="relative min-h-[460px] border border-bone/15 bg-coal-950 p-6 md:p-9">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex min-h-[400px] flex-col items-start justify-center"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-copper text-coal-950">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-4xl font-black uppercase">You&rsquo;re on the list.</h3>
                <p className="mt-3 max-w-sm text-bone/70">
                  We&rsquo;ll call within one business day to set a time. (This
                  is a demo, so nothing was actually sent.)
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setFields({ name: "", phone: "", address: "", issue: "" });
                    setTouched({});
                  }}
                  className="mt-6 font-semibold text-copper hover:underline"
                >
                  Reset the demo form
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <Field
                  label="Name"
                  value={fields.name}
                  error={touched.name ? errors.name : ""}
                  onChange={(v) => setFields((f) => ({ ...f, name: v }))}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={fields.phone}
                  error={touched.phone ? errors.phone : ""}
                  onChange={(v) => setFields((f) => ({ ...f, phone: v }))}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                />
                <Field
                  label="Property address"
                  value={fields.address}
                  error={touched.address ? errors.address : ""}
                  onChange={(v) => setFields((f) => ({ ...f, address: v }))}
                  onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                />
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-bone/60">
                    What&rsquo;s going on?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {ISSUES.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={fields.issue === opt}
                        onClick={() => setFields((f) => ({ ...f, issue: opt }))}
                        className={`border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                          fields.issue === opt
                            ? "border-copper bg-copper text-coal-950"
                            : "border-bone/20 text-bone/70 hover:border-bone/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button
                  type="submit"
                  className="w-full bg-copper py-4 font-bold uppercase tracking-wide text-coal-950 transition-colors hover:bg-bone"
                >
                  Book my free inspection
                </button>
                <p className="text-center text-xs text-bone/40">
                  Demo form. Nothing you type leaves this page.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-bone/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full border bg-coal-900 px-4 py-3.5 text-bone outline-none transition-colors duration-200 focus:border-copper ${
          error ? "border-red-400/70" : "border-bone/15"
        }`}
      />
      {error && <span className="mt-1.5 block text-sm text-red-300">{error}</span>}
    </label>
  );
}

function Tick() {
  return <span className="h-2 w-2 shrink-0 bg-copper" />;
}
