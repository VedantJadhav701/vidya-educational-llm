'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { normalizeMarkdown } from '@/lib/markdown';

interface EducationalBlockProps {
  content: string;
  theme?: 'dark' | 'light';
}

export default function EducationalBlock({ content, theme = 'dark' }: EducationalBlockProps) {
  const normalizedText = normalizeMarkdown(content);
  const isDark = theme === 'dark';

  return (
    <div
      className={`educational-textbook-page rounded-3xl p-6 shadow-2xl leading-relaxed relative overflow-hidden backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? 'bg-[#0b0f19]/90 border border-white/15 text-[#f1f5f9] theme-dark'
          : 'bg-white border border-neutral-200 text-neutral-900 shadow-xl theme-light'
      }`}
    >
      {/* Top Textbook Header Decoration */}
      <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#38bdf8]' : 'text-blue-600'}`}>
            Vidya Interactive Lesson
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
          isDark
            ? 'text-[#94a3b8] bg-white/5 border-white/10'
            : 'text-neutral-500 bg-neutral-100 border-neutral-250'
        }`}>
          NCERT Curriculum Aligned
        </span>
      </div>

      {/* Structured Content Markdown Renderer */}
      <div className={`max-w-none text-sm leading-relaxed ${isDark ? 'prose prose-invert' : 'prose text-neutral-900'}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => (
              <p className={`mb-4 leading-relaxed ${isDark ? 'text-[#e2e8f0]' : 'text-neutral-800 font-normal'}`}>
                {children}
              </p>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className={`w-full text-left border-collapse border rounded-lg ${isDark ? 'border-white/10' : 'border-neutral-250'}`}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className={isDark ? 'bg-white/5' : 'bg-neutral-100'}>{children}</thead>,
            th: ({ children }) => (
              <th className={`p-3 border-b font-bold ${isDark ? 'border-white/10 text-[#38bdf8]' : 'border-neutral-250 text-blue-600'}`}>{children}</th>
            ),
            td: ({ children }) => (
              <td className={`p-3 border-b ${isDark ? 'border-white/10/50 text-[#f1f5f9]' : 'border-neutral-200 text-neutral-800'}`}>{children}</td>
            ),
            h1: ({ children }) => (
              <div className={`my-4 border-b pb-2 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  <span>📘</span> {children}
                </h1>
              </div>
            ),
            h2: ({ children }) => (
              <h2 className={`text-base font-bold my-3 flex items-center gap-2 ${isDark ? 'text-[#38bdf8]' : 'text-blue-600'}`}>
                <span>📍</span> {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-sm font-semibold my-2 ${isDark ? 'text-[#a855f7]' : 'text-purple-600'}`}>{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className={`list-disc ml-5 mb-4 space-y-1.5 ${isDark ? 'text-[#cbd5e1]' : 'text-neutral-800'}`}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className={`list-decimal ml-5 mb-4 space-y-1.5 ${isDark ? 'text-[#cbd5e1]' : 'text-neutral-800'}`}>{children}</ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,

            // Math & Code Block Styling
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className={`font-mono text-xs px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-[#1e293b] text-[#ec4899] border-white/10'
                    : 'bg-neutral-100 text-pink-600 border-neutral-300'
                }`}>
                  {children}
                </code>
              ) : (
                <div className={`my-4 p-4 rounded-2xl border font-mono text-xs overflow-x-auto shadow-inner ${
                  isDark
                    ? 'bg-[#070a14] text-[#38bdf8] border-white/10'
                    : 'bg-neutral-900 text-blue-400 border-neutral-800'
                }`}>
                  <code>{children}</code>
                </div>
              );
            },

            // Educational Callout Block (Blockquotes)
            blockquote: ({ children }) => (
              <div className={`my-4 p-4 rounded-2xl border-l-4 font-medium shadow-md ${
                isDark
                  ? 'bg-gradient-to-r from-[#a855f7]/15 via-transparent to-[#38bdf8]/10 border-[#a855f7] text-[#f1f5f9]'
                  : 'bg-purple-500/10 border-purple-600 text-neutral-900'
              }`}>
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
      <div className={`mt-6 pt-3 border-t flex items-center justify-between text-[11px] ${
        isDark ? 'border-white/10 text-[#94a3b8]' : 'border-neutral-200 text-neutral-500'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Mathematically &amp; Scientifically Verified
        </span>
        <span className="italic">Vidya 1.7B Educational Intelligence</span>
      </div>
    </div>
  );
}
