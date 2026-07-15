import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-ink-950/[0.08] bg-paper-200/70">
      <div className="mx-auto max-w-page px-6 py-14 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <p className="font-display text-xl font-bold text-ink-950">
              {site.name}
              <span className="text-copper">.</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-950/55">
              {site.tagline} {site.serviceArea}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold text-ink-950/80">Explore</p>
              <ul className="mt-3 space-y-2 text-ink-950/55">
                <li><a href="#build" className="transition-colors hover:text-copper">The Build</a></li>
                <li><a href="#services" className="transition-colors hover:text-copper">Services</a></li>
                <li><a href="#work" className="transition-colors hover:text-copper">Our Work</a></li>
                <li><a href="#process" className="transition-colors hover:text-copper">Process</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink-950/80">Contact</p>
              <ul className="mt-3 space-y-2 text-ink-950/55">
                <li>
                  <a href={site.phoneHref} className="transition-colors hover:text-copper">{site.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-copper">{site.email}</a>
                </li>
                <li>{site.city}, USA</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink-950/80">Hours</p>
              <ul className="mt-3 space-y-2 text-ink-950/55">
                <li>Mon–Fri · 7a–6p</li>
                <li>Sat · 8a–2p</li>
                <li>24/7 storm line</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-950/[0.08] pt-6 text-xs text-ink-950/40 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {site.legalName} — a fictional brand.
            This site is a design demo; every name, number, and review is invented.
          </p>
          <p>
            Demo crafted to showcase modern web design for trade businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
