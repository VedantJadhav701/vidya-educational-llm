'use client';

import { useEffect, useRef, useState, MouseEvent } from 'react';
import { generateGraphData } from '@/lib/graph';

interface GraphCardProps {
  expr: string;
  title?: string;
}

export default function GraphCard({ expr, title }: GraphCardProps) {
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

    // Dark Background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    const seriesList = generateGraphData(expr);
    const colors = ['#a855f7', '#38bdf8', '#10b981', '#f59e0b', '#ef4444'];

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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
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
    ctx.fillStyle = '#94a3b8';
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
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(hcx, margin);
        ctx.lineTo(hcx, height - margin);
        ctx.moveTo(margin, hcy);
        ctx.lineTo(width - margin, hcy);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(hcx, hcy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Border
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, plotWidth, plotHeight);

  }, [expr, range, showGrid, hoverPos]);

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

  return (
    <div className="media-card bg-[#0b0f19]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
      {/* Card Header & Controls */}
      <div className="p-3 px-4 bg-[#1e293b]/60 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#a855f7] flex items-center gap-1.5">
          <span>📊</span> {title || `Graph: ${expr}`}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-[#94a3b8]">
          <button
            onClick={() => setShowGrid((prev) => !prev)}
            className={`px-2 py-0.5 rounded transition-colors ${
              showGrid ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-white/5 text-[#94a3b8]'
            }`}
          >
            Grid
          </button>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
            <span>Range:</span>
            <button
              onClick={() => setRange((r) => Math.max(5, r - 5))}
              className="hover:text-white px-1"
            >
              -
            </button>
            <span className="text-white font-mono">{range}</span>
            <button
              onClick={() => setRange((r) => Math.min(25, r + 5))}
              className="hover:text-white px-1"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-3 bg-[#0b0f19] flex flex-col items-center relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPos(null)}
          className="w-full max-w-[400px] h-auto rounded-lg border border-white/5 cursor-crosshair"
        />

        {/* Live Coordinate Badge */}
        {hoverPos && (
          <div className="absolute top-5 right-5 text-[10px] font-mono bg-[#0b0f19]/90 border border-[#a855f7]/40 text-[#38bdf8] px-2 py-1 rounded shadow-lg backdrop-blur">
            x: {hoverPos.x}, y: {hoverPos.y}
          </div>
        )}
      </div>

      <div className="p-2.5 text-[11px] text-[#94a3b8] text-center bg-[#0b0f19]/90 border-t border-white/5">
        Interactive Canvas • Hover to trace coordinates
      </div>
    </div>
  );
}
