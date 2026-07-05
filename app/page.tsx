import SiteShell from "@/components/shell/SiteShell";
import TopBar from "@/components/portfolio/TopBar";
import Hero from "@/components/portfolio/Hero";
import Work from "@/components/portfolio/Work";
import About from "@/components/portfolio/About";
import Playground from "@/components/portfolio/Playground";
import Witnesses from "@/components/portfolio/Witnesses";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  // Sections are server-rendered semantic HTML (SEO source of truth);
  // SiteShell layers the noir atmosphere + interactions over them client-side.
  return (
    <SiteShell>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Playground />
        <Witnesses />
        <Contact />
        <Footer />
      </main>
    </SiteShell>
  );
}
