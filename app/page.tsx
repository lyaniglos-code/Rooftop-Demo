import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WordBand } from "@/components/WordBand";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { HowWeWork } from "@/components/HowWeWork";
import { RecentWork } from "@/components/RecentWork";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WordBand />
        <Services />
        <Stats />
        <HowWeWork />
        <RecentWork />
        <Testimonials />
        <FAQ />
        <QuoteCTA />
      </main>
      <Footer />
    </>
  );
}
