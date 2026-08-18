'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LandingNavbar from '@/components/Landing/Navbar';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import Subjects from '@/components/Landing/Subjects';
import Languages from '@/components/Landing/Languages';
import HowItWorks from '@/components/Landing/HowItWorks';
import CTA from '@/components/Landing/CTA';
import Footer from '@/components/Landing/Footer';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="w-full min-h-screen bg-[#070a14] flex flex-col relative overflow-hidden selection:bg-[#a855f7]/30 selection:text-white">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="flex-1 flex flex-col min-h-screen animate-fadeIn">
          {/* Landing Navigation Header */}
          <LandingNavbar />

          {/* Landing Sections */}
          <Hero />
          
          {/* Trust Section built-in to page as per Section 4 of plan */}
          <section className="py-8 bg-[#0b0f19]/30 border-y border-white/5 text-center">
            <div className="max-w-7xl mx-auto px-4 text-xs font-bold text-[#64748b] tracking-wider uppercase flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8">
              <span>🚀 Local &amp; Serverless Neural Inference</span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>📚 Specialized NCERT Curriculum Knowledge</span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>🔒 100% Private &amp; Anonymized Learning Sessions</span>
            </div>
          </section>

          <Features />
          <Subjects />
          <Languages />
          <HowItWorks />
          <CTA />
          <Footer />
        </div>
      )}
    </main>
  );
}
