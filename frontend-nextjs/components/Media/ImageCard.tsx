'use client';

import { useState } from 'react';

interface ImageCardProps {
  url: string;
  title: string;
  isWikiImage?: boolean;
}

export default function ImageCard({ url, title, isWikiImage }: ImageCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (hasError) return null;

  return (
    <>
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="media-card bg-[#0b0f19]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-fadeIn cursor-pointer group hover:border-[#a855f7]/50 transition-all duration-300"
      >
        <div className="relative overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={title}
            onError={() => setHasError(true)}
            className={`w-full max-h-[260px] object-contain block transition-transform duration-300 group-hover:scale-105 ${
              isWikiImage ? 'bg-white p-3 rounded-t-xl' : 'bg-transparent'
            }`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
            <span>🔍 Click to expand</span>
          </div>
        </div>

        <div className="media-card-title p-3 text-xs text-[#e2e8f0] text-center bg-[#0b0f19]/90 font-medium border-t border-white/5 flex items-center justify-between">
          <span className="truncate max-w-[220px]">{title}</span>
          <span className="text-[10px] text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded-full border border-[#a855f7]/20">
            Reference
          </span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn cursor-zoom-out"
        >
          <div className="max-w-4xl w-full bg-[#0b0f19] border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={title}
              className="max-h-[80vh] w-auto object-contain rounded-lg bg-white p-2"
            />
            <div className="mt-4 text-center">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-[#94a3b8] mt-1">Click anywhere to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
