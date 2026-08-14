'use client';

import { useEffect, useRef } from 'react';
import { generateGraphData } from '@/lib/graph';

interface GraphCardProps {
  expr: string;
  title?: string;
}

export default function GraphCard({ expr, title }: GraphCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const seriesList = generateGraphData(expr);
    const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;

    const xMin = -10;
    const xMax = 10;
    const yMin = -10;
    const yMax = 10;

    const toCanvasX = (x: number) => margin + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const toCanvasY = (y: number) => height - margin - ((y - yMin) / (yMax - yMin)) * plotHeight;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let x = -10; x <= 10; x += 2) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, margin);
      ctx.lineTo(cx, height - margin);
      ctx.stroke();
    }

    for (let y = -10; y <= 10; y += 2) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(margin, cy);
      ctx.lineTo(width - margin, cy);
      ctx.stroke();
    }

    // Axes
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;

    // X axis
    const cy0 = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(margin, cy0);
    ctx.lineTo(width - margin, cy0);
    ctx.stroke();

    // Y axis
    const cx0 = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(cx0, margin);
    ctx.lineTo(cx0, height - margin);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    for (let x = -10; x <= 10; x += 5) {
      if (x !== 0) {
        ctx.fillText(String(x), toCanvasX(x), cy0 + 14);
      }
    }

    ctx.textAlign = 'right';
    for (let y = -10; y <= 10; y += 5) {
      if (y !== 0) {
        ctx.fillText(String(y), cx0 - 6, toCanvasY(y) + 4);
      }
    }

    // Plot series
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

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, plotWidth, plotHeight);

  }, [expr]);

  return (
    <div className="media-card bg-[#0f172a]/60 border border-white/5 rounded-xl overflow-hidden shadow-lg animate-fadeIn">
      <div className="p-3 bg-[#0f172a] flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="w-full max-w-[400px] h-auto rounded border border-white/5"
        />
      </div>
      <div className="media-card-title p-3 text-xs text-[#e2e8f0] text-center bg-[#0f172a]/80 font-medium">
        {title || `Graph of: ${expr}`}
      </div>
    </div>
  );
}
