'use client';

import { useState } from 'react';
import { MediaCardItem } from '@/lib/types';
import ImageCard from './ImageCard';
import GraphCard from './GraphCard';
import FormulaSheet from './FormulaSheet';

interface MediaPanelProps {
  items: MediaCardItem[];
  onSelectFormula?: (query: string) => void;
}

export default function MediaPanel({ items, onSelectFormula }: MediaPanelProps) {
  const [activeTab, setActiveTab] = useState<'visuals' | 'formulas'>('visuals');

  return (
    <aside className="media-panel flex-1 h-full bg-[#1e293b]/70 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl min-w-[320px]">
      {/* Header Tabs */}
      <div className="panel-header px-5 py-4 border-b border-white/10 bg-[#0f172a]/80 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('visuals')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'visuals'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white shadow-md'
                : 'bg-white/5 text-[#94a3b8] hover:text-white'
            }`}
          >
            🖼️ Visuals &amp; Graphs
            {items.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {items.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formulas'
                ? 'bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-md'
                : 'bg-white/5 text-[#94a3b8] hover:text-white'
            }`}
          >
            📑 NCERT Formulas
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="panel-content flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
        {activeTab === 'formulas' ? (
          <FormulaSheet onSelectFormula={onSelectFormula} />
        ) : items.length === 0 ? (
          <div className="empty-state flex flex-col items-center justify-center h-full text-[#64748b] text-center p-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 shadow-inner">
              🎨
            </div>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1">Interactive Learning Panel</h3>
            <p className="text-xs text-[#94a3b8]/80 leading-relaxed max-w-[240px]">
              Educational images and mathematical graphs will render here automatically when Vidya explains a concept!
            </p>

            <div className="mt-6 border-t border-white/5 pt-4 w-full text-left">
              <span className="text-[11px] font-medium text-[#a855f7] block mb-2">Try asking:</span>
              <ul className="text-xs text-[#94a3b8] space-y-1.5 font-mono">
                <li className="bg-white/5 p-2 rounded-lg border border-white/5">📷 &quot;Picture of photosynthesis&quot;</li>
                <li className="bg-white/5 p-2 rounded-lg border border-white/5">📈 &quot;Graph y = x^2&quot;</li>
              </ul>
            </div>
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
