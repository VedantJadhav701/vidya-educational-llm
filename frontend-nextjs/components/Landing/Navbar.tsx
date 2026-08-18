'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, GraduationCap } from 'lucide-react';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070a14]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#6366f1] to-[#ec4899] flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <Link href="/" className="text-lg font-black tracking-widest text-white hover:opacity-90 transition-opacity">
              VIDYA
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-[#94a3b8]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#subjects" className="hover:text-white transition-colors">
              Subjects
            </a>
            <a href="#languages" className="hover:text-white transition-colors">
              Languages
            </a>
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <span>Enter Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Hamburger Menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#070a14] border-b border-white/5 px-4 pt-2 pb-4 space-y-3">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5"
          >
            Features
          </a>
          <a
            href="#subjects"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5"
          >
            Subjects
          </a>
          <a
            href="#languages"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5"
          >
            Languages
          </a>
          <Link
            href="/playground"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-sm font-bold"
          >
            <span>Enter Playground</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </nav>
  );
}
