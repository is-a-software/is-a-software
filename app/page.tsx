import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
 
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar currentPage="home" />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
