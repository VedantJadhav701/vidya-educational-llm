'use client';

import { useEffect, useRef, useState, MouseEvent } from 'react';
import { generateGraphData } from '@/lib/graph';

interface GraphCardProps {
  expr: string;
  title?: string;
  theme?: 'dark' | 'light';
}

export default function GraphCard({ expr, title, theme = 'dark' }: GraphCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [range, setRange] = useState(10);
  const [showGrid, setShowGrid] = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const isDark = theme === 'dark';

    // Theme-Responsive Background
    ctx.fillStyle = isDark ? '#121212' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const seriesList = generateGraphData(expr);
    const colors = isDark 
      ? ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'] 
      : ['#2563eb', '#059669', '#d97706', '#db2777', '#dc2626'];

    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;

    const xMin = -range;
    const xMax = range;
    const yMin = -range;
    const yMax = range;

    const toCanvasX = (x: number) => margin + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const toCanvasY = (y: number) => height - margin - ((y - yMin) / (yMax - yMin)) * plotHeight;

    // Grid lines
    if (showGrid) {
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const gridStep = range > 10 ? 5 : 2;

      for (let x = -range; x <= range; x += gridStep) {
        const cx = toCanvasX(x);
        ctx.beginPath();
        ctx.moveTo(cx, margin);
        ctx.lineTo(cx, height - margin);
        ctx.stroke();
      }

      for (let y = -range; y <= range; y += gridStep) {
        const cy = toCanvasY(y);
        ctx.beginPath();
        ctx.moveTo(margin, cy);
        ctx.lineTo(width - margin, cy);
        ctx.stroke();
      }
    }

    // Main Axes
    ctx.setLineDash([]);
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.5;

    // X Axis
    const cy0 = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(margin, cy0);
    ctx.lineTo(width - margin, cy0);
    ctx.stroke();

    // Y Axis
    const cx0 = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(cx0, margin);
    ctx.lineTo(cx0, height - margin);
    ctx.stroke();

    // Axis Ticks & Labels
    ctx.fillStyle = isDark ? '#94a3b8' : '#666666';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';

    const tickStep = range > 10 ? 5 : 2;
    for (let x = -range; x <= range; x += tickStep) {
      if (x !== 0) {
        ctx.fillText(String(x), toCanvasX(x), Math.min(Math.max(cy0 + 14, margin + 12), height - margin - 4));
      }
    }

    ctx.textAlign = 'right';
    for (let y = -range; y <= range; y += tickStep) {
      if (y !== 0) {
        ctx.fillText(String(y), Math.min(Math.max(cx0 - 6, margin + 18), width - margin - 4), toCanvasY(y) + 4);
      }
    }

    // Plot Curves
    seriesList.forEach((series, idx) => {
      const color = colors[idx % colors.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      if (series.isVertical && series.vVal !== undefined) {
        const vx = toCanvasX(series.vVal);
        ctx.beginPath();
        ctx.moveTo(vx, margin);
        ctx.lineTo(vx, height - margin);
        ctx.stroke();
      } else if (series.points.length > 0) {
        ctx.beginPath();
        let started = false;
        series.points.forEach((pt) => {
          const cx = toCanvasX(pt.x);
          const cy = toCanvasY(pt.y);
          if (!started) {
            ctx.moveTo(cx, cy);
            started = true;
          } else {
            ctx.lineTo(cx, cy);
          }
        });
        ctx.stroke();
      }
    });

    // Hover Coordinate Indicator
    if (hoverPos) {
      const hcx = toCanvasX(hoverPos.x);
      const hcy = toCanvasY(hoverPos.y);

      if (hcx >= margin && hcx <= width - margin && hcy >= margin && hcy <= height - margin) {
        ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(hcx, margin);
        ctx.lineTo(hcx, height - margin);
        ctx.moveTo(margin, hcy);
        ctx.lineTo(width - margin, hcy);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
        ctx.beginPath();
        ctx.arc(hcx, hcy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Border
    ctx.setLineDash([]);
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, plotWidth, plotHeight);

  }, [expr, range, showGrid, hoverPos, theme]);

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const margin = 40;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;

    const x = -range + ((px - margin) / plotWidth) * (2 * range);
    const y = range - ((py - margin) / plotHeight) * (2 * range);

    setHoverPos({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${title || 'graph'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const isDark = theme === 'dark';

  return (
    <div className="media-card bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-md animate-fadeIn w-full max-w-[400px]">
      {/* Card Header & Controls */}
      <div className="p-3 px-4 bg-neutral-200/50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
          <span>📊</span> {title || `Graph: ${expr}`}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          <button
            onClick={() => setShowGrid((prev) => !prev)}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              showGrid ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white font-bold' : 'bg-neutral-300/30 text-neutral-500'
            }`}
          >
            Grid
          </button>
          <div className="flex items-center gap-1 bg-neutral-200/35 dark:bg-neutral-950/40 px-2 py-0.5 rounded">
            <span>Range:</span>
            <button
              onClick={() => setRange((r) => Math.max(5, r - 5))}
              className="hover:text-neutral-900 dark:hover:text-white px-1 font-bold cursor-pointer"
            >
              -
            </button>
            <span className="text-neutral-900 dark:text-white font-mono">{range}</span>
            <button
              onClick={() => setRange((r) => Math.min(25, r + 5))}
              className="hover:text-neutral-900 dark:hover:text-white px-1 font-bold cursor-pointer"
            >
              +
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="ml-1 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-3 bg-neutral-200/20 dark:bg-neutral-950 flex flex-col items-center relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPos(null)}
          className="w-full max-w-[400px] h-auto rounded-lg border border-neutral-300 dark:border-neutral-850 cursor-crosshair"
        />

        {/* Live Coordinate Badge */}
        {hoverPos && (
          <div className="absolute top-5 right-5 text-[10px] font-mono bg-neutral-950/90 border border-neutral-700 text-neutral-300 px-2 py-1 rounded shadow-lg backdrop-blur">
            x: {hoverPos.x}, y: {hoverPos.y}
          </div>
        )}
      </div>

      <div className="p-2.5 text-[11px] text-neutral-500 dark:text-neutral-400 text-center bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-850/50">
        Interactive Canvas • Hover to trace coordinates
      </div>
    </div>
  );
}
