"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Quote CTA — floating-label form with inline validation and an animated
 * success state (drawn checkmark). Demo only: nothing is sent anywhere.
 */
export function QuoteCTA() {
  const [sent, setSent] = useState(false);
  const [fields, setFields] = useState({ name: "", phone: "", address: "", service: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: fields.name.trim().length < 2 ? "Please tell us your name" : "",
    phone: !/^[\d\s()+-]{7,}$/.test(fields.phone) ? "Enter a valid phone number" : "",
    address: fields.address.trim().length < 5 ? "Enter the property address" : "",
    service: "",
  };
  const invalid = Object.values(errors).some(Boolean);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });
    if (!invalid) setSent(true);
  };

  return (
    <section id="quote" className="relative scroll-mt-24 overflow-hidden border-t border-ink-950/[0.07]">
      {/* Warm backdrop washes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 animate-drift-a rounded-full bg-copper/10 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 animate-drift-b rounded-full bg-sky2/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto grid max-w-page items-center gap-14 px-6 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper">
            Free inspection
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tightest text-ink-950 md:text-5xl">
            Your roof has an opinion.{" "}
            <span className="copper-clip">Let&rsquo;s hear it.</span>
          </h2>
          <p className="mt-5 max-w-md text-ink-950/65">
            A 40-minute inspection, photos of everything we find, and a fixed
            quote good for 90 days. No pressure, no phone-tree — ever.
          </p>
          <div className="mt-8 space-y-3 text-sm text-ink-950/60">
            <p className="flex items-center gap-3">
              <Dot /> Same-week appointments
            </p>
            <p className="flex items-center gap-3">
              <Dot /> Insurance claims handled end to end
            </p>
            <p className="flex items-center gap-3">
              <Dot /> Or call{" "}
              <a href={site.phoneHref} className="font-semibold text-copper hover:underline">
                {site.phone}
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass relative min-h-[430px] rounded-3xl p-7 md:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[370px] flex-col items-center justify-center text-center"
                >
                  <svg className="h-20 w-20" viewBox="0 0 64 64" aria-hidden="true">
                    <motion.circle
                      cx="32" cy="32" r="28"
                      fill="none" stroke="rgb(var(--accent))" strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                    <motion.path
                      d="M20 33 L28 41 L44 24"
                      fill="none" stroke="rgb(var(--accent))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.55, ease: EASE }}
                    />
                  </svg>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-ink-950">
                    You&rsquo;re on the books.
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-ink-950/65">
                    We&rsquo;ll call within one business day to schedule your
                    inspection. (This is a demo — nothing was actually sent.)
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFields({ name: "", phone: "", address: "", service: "" });
                      setTouched({});
                    }}
                    className="mt-6 text-sm font-medium text-copper hover:underline"
                  >
                    Reset the demo form
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  noValidate
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-5"
                >
                  <Field
                    label="Your name"
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
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-950/50">
                      What&rsquo;s going on up there?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Leak / storm damage", "Aging roof", "New build", "Just curious"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFields((f) => ({ ...f, service: opt }))}
                          className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                            fields.service === opt
                              ? "border-copper bg-copper/15 text-copper"
                              : "border-ink-950/15 text-ink-950/60 hover:border-ink-950/35"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full bg-copper py-4 text-base font-semibold text-white transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
                  >
                    Book my free inspection
                  </motion.button>
                  <p className="text-center text-xs text-ink-950/40">
                    Demo form — no data leaves this page.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
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
  const [focused, setFocused] = useState(false);
  const float = focused || value.length > 0;

  return (
    <div>
      <div
        className={`relative rounded-xl border bg-white/70 transition-colors duration-300 ${
          error ? "border-red-500/50" : focused ? "border-copper/60" : "border-ink-950/10"
        }`}
      >
        <label
          className={`pointer-events-none absolute left-4 transition-all duration-300 ease-smooth ${
            float ? "top-1.5 text-[10px] uppercase tracking-wider text-copper" : "top-1/2 -translate-y-1/2 text-sm text-ink-950/45"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          className="w-full bg-transparent px-4 pb-2.5 pt-6 text-ink-950 outline-none"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-1.5 text-xs text-red-600/90"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />;
}
