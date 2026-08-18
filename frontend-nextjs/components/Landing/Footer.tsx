import { ExternalLink } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#070a14] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-lg font-black text-white tracking-widest">
            VIDYA
          </span>
          <span className="text-xs text-[#94a3b8] mt-1 font-medium">
            AI Learning Laboratory • Interactive Multilingual Companion
          </span>
        </div>

        {/* Center/Right Side: Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#94a3b8] font-bold">
          <a
            href="https://github.com/VedantJadhav701/vidya-educational-llm"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://huggingface.co/spaces/vedantjadhav701/vidya-1.7b"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Hugging Face Space</span>
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#subjects"
            className="hover:text-white transition-colors"
          >
            Subjects
          </a>
        </div>
      </div>
      
      {/* Copyright Line */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-[#475569] font-medium">
        &copy; {currentYear} Vidya AI. Created by Vedant Jadhav. All rights reserved.
      </div>
    </footer>
  );
}
