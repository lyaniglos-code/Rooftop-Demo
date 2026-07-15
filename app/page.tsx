import { DuskSky } from "@/components/DuskSky";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustMarquee } from "@/components/TrustMarquee";
import { RoofBuilder } from "@/components/RoofBuilder";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Footer } from "@/components/Footer";
import { DepthSection } from "@/components/DepthSection";

export default function Home() {
  return (
    <>
      <DuskSky />
      <Nav />
      <main>
        <Hero />
        <TrustMarquee />
        <RoofBuilder />
        <Stats />
        <DepthSection>
          <Services />
        </DepthSection>
        <DepthSection>
          <BeforeAfter />
        </DepthSection>
        <Process />
        <DepthSection>
          <Testimonials />
        </DepthSection>
        <FAQ />
        <DepthSection>
          <QuoteCTA />
        </DepthSection>
      </main>
      <Footer />
    </>
  );
}
