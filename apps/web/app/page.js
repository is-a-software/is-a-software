import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DomainChecker from '@/components/DomainChecker';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DomainChecker />
      <Features />
      <Footer />
    </>
  );
}
