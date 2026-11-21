import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DomainChecker from '@/components/DomainChecker';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import AuthErrorNotice from '@/components/AuthErrorNotice';

export default function Home() {
  return (
    <>
      <Navbar />
      <AuthErrorNotice />
      <Hero />
      <DomainChecker />
      <Features />
      <Footer />
    </>
  );
}
