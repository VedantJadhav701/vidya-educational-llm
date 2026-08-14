'use client';

import { useState } from 'react';

interface ImageCardProps {
  url: string;
  title: string;
  isWikiImage?: boolean;
}

export default function ImageCard({ url, title, isWikiImage }: ImageCardProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <div className="media-card bg-[#0f172a]/60 border border-white/5 rounded-xl overflow-hidden shadow-lg animate-fadeIn">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={title}
        onError={() => setHasError(true)}
        className={`w-full max-h-[280px] object-contain block border-b border-white/5 ${
          isWikiImage ? 'bg-white p-2.5 rounded-t-lg' : 'bg-transparent'
        }`}
      />
      <div className="media-card-title p-3 text-xs text-[#e2e8f0] text-center bg-[#0f172a]/80 font-medium">
        {title}
      </div>
    </div>
  );
}
