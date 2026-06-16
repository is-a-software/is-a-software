'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProtectedPageLoader({ message = 'Loading...' }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto glass p-8 text-slate-300">{message}</div>
      </div>
      <Footer />
    </>
  );
}
