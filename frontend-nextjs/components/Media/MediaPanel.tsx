'use client';

import { MediaCardItem } from '@/lib/types';
import ImageCard from './ImageCard';
import GraphCard from './GraphCard';

interface MediaPanelProps {
  items: MediaCardItem[];
}

export default function MediaPanel({ items }: MediaPanelProps) {
  return (
    <aside className="media-panel flex-1 h-full bg-[#1e293b]/70 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl min-w-[300px]">
      <div className="panel-header px-6 py-5 border-b border-white/10 bg-[#0f172a]/60 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#f1f5f9]">Visuals & Reference</h2>
        {items.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a855f7]/20 text-[#a855f7] font-medium border border-[#a855f7]/30">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      <div className="panel-content flex-1 p-5 overflow-y-auto flex flex-col gap-5 custom-scrollbar">
        {items.length === 0 ? (
          <div className="empty-state flex flex-col items-center justify-center h-full text-[#64748b] text-center p-5">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="mb-4 opacity-50 text-[#94a3b8]"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p className="text-xs text-[#94a3b8]/80 leading-relaxed max-w-[220px]">
              Graphs and images will appear here automatically when Vidya explains a concept.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id}>
              {item.type === 'image' && item.url && (
                <ImageCard url={item.url} title={item.title} isWikiImage={item.isWikiImage} />
              )}
              {item.type === 'graph' && item.expr && (
                <GraphCard expr={item.expr} title={item.title} />
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
