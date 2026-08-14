'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { normalizeMarkdown } from '@/lib/markdown';

interface EducationalBlockProps {
  content: string;
}

export default function EducationalBlock({ content }: EducationalBlockProps) {
  const normalizedText = normalizeMarkdown(content);

  return (
    <div className="educational-textbook-page bg-[#0b0f19]/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-[#f1f5f9] leading-relaxed relative overflow-hidden backdrop-blur-md">
      {/* Top Textbook Header Decoration */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
            Vidya Interactive Lesson
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#94a3b8] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          NCERT Curriculum Aligned
        </span>
      </div>

      {/* Structured Content Markdown Renderer */}
      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p className="mb-4 leading-relaxed text-[#e2e8f0]">{children}</p>,
            h1: ({ children }) => (
              <div className="my-4 border-b border-white/10 pb-2">
                <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>📘</span> {children}
                </h1>
              </div>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold my-3 text-[#38bdf8] flex items-center gap-2">
                <span>📍</span> {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold my-2 text-[#a855f7]">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-5 mb-4 space-y-1.5 text-[#cbd5e1]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-5 mb-4 space-y-1.5 text-[#cbd5e1]">{children}</ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,

            // Math & Code Block Styling
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-[#1e293b] text-[#ec4899] font-mono text-xs px-1.5 py-0.5 rounded border border-white/10">
                  {children}
                </code>
              ) : (
                <div className="my-4 bg-[#070a14] p-4 rounded-2xl border border-white/10 shadow-inner font-mono text-xs text-[#38bdf8] overflow-x-auto">
                  <code>{children}</code>
                </div>
              );
            },

            // Educational Callout Block (Blockquotes)
            blockquote: ({ children }) => (
              <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#a855f7]/15 via-transparent to-[#38bdf8]/10 border-l-4 border-[#a855f7] text-[#f1f5f9] font-medium shadow-md">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#a855f7] mb-1 flex items-center gap-1">
                  💡 Key Educational Concept
                </div>
                <div>{children}</div>
              </div>
            ),
          }}
        >
          {normalizedText}
        </ReactMarkdown>
      </div>

      {/* Bottom Footer Accent */}
      <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94a3b8]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Mathematically &amp; Scientifically Verified
        </span>
        <span className="italic">Vidya 1.7B Educational Intelligence</span>
      </div>
    </div>
  );
}
