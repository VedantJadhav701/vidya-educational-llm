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
        className="media-card bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-md cursor-pointer group hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300 w-full max-w-[400px]"
      >
        <div className="relative overflow-hidden bg-neutral-250 dark:bg-neutral-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={title}
            onError={() => setHasError(true)}
            className={`w-full max-h-[200px] object-contain block transition-transform duration-300 group-hover:scale-105 ${
              isWikiImage ? 'bg-white p-3 rounded-t-xl' : 'bg-transparent'
            }`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
            <span>🔍 Click to expand</span>
          </div>
        </div>

        <div className="media-card-title p-3 text-xs text-neutral-800 dark:text-neutral-200 text-center bg-neutral-100 dark:bg-neutral-900 font-medium border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="truncate max-w-[220px]">{title}</span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-700">
            Image
          </span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn cursor-zoom-out"
        >
          <div className="max-w-4xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col items-center cursor-default" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={title}
              className="max-h-[70vh] w-auto object-contain rounded-lg bg-white p-2 shadow-lg"
            />
            <div className="mt-4 flex items-center justify-between w-full border-t border-neutral-800 pt-4">
              <div className="text-left">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">Click outside to close</p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${title || 'image'}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                  } catch (err) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.download = `${title || 'image'}.png`;
                    link.click();
                  }
                }}
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-all cursor-pointer shadow-sm"
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
