import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatusCard from '@/components/StatusCard';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatusCard />
      <Features />
      <Footer />
    </>
  );
}
