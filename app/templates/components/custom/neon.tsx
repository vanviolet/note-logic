"use client";

import { useEffect, useRef } from "react";
import { cn } from "~/templates/lib/utils";

export interface NeonBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** Neon colors */
  colors?: string[];
  /** Number of neon rings */
  count?: number;
  /** Glow intensity */
  intensity?: number;
  /** Animation speed */
  speed?: number;
}

interface NeonRing {
  x: number;
  y: number;
  radius: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  pulseOffset: number;
  pulseSpeed: number;
  lineWidth: number;
}

export function NeonBackground({
  className,
  children,
  colors = ["#00ffff", "#ff00ff", "#8b5cf6", "#00ff88", "#ff6b6b"],
  count = 6,
  intensity = 1,
  speed = 1,
}: NeonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let tick = 0;

    // Create neon rings with intentional placement - responsive to screen size
    const createRings = (): NeonRing[] => {
      const rings: NeonRing[] = [];
      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);
      const scale = minDim / 800; // Base scale factor

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const distanceFromCenter = (100 + (i % 3) * 80) * scale;

        rings.push({
          x: cx + Math.cos(angle) * distanceFromCenter,
          y: cy + Math.sin(angle) * distanceFromCenter,
          radius: (40 + (i % 4) * 25) * scale,
          color: colors[i % colors.length],
          orbitRadius: (30 + i * 15) * scale,
          orbitSpeed: (0.0003 + i * 0.0001) * (i % 2 === 0 ? 1 : -1),
          orbitOffset: angle,
          pulseOffset: (i / count) * Math.PI * 2,
          pulseSpeed: 0.015 + (i % 3) * 0.005,
          lineWidth: Math.max(1.5, (2 + (i % 3)) * scale),
        });
      }

      return rings;
    };

    let rings = createRings();

    // Resize handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      rings = createRings();
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Draw glowing ring
    const drawRing = (ring: NeonRing, x: number, y: number, scale: number) => {
      const radius = ring.radius * scale;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.lineWidth * 12 * intensity;
      ctx.globalAlpha = 0.1;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 40 * intensity;
      ctx.stroke();

      // Middle glow
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.lineWidth = ring.lineWidth * 5 * intensity;
      ctx.globalAlpha = 0.3;
      ctx.shadowBlur = 20 * intensity;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.lineWidth = ring.lineWidth * 2;
      ctx.globalAlpha = 0.8;
      ctx.shadowBlur = 10 * intensity;
      ctx.stroke();

      // Bright inner core
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = ring.lineWidth * 0.8;
      ctx.globalAlpha = 0.6;
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    // Animation
    const animate = () => {
      tick += speed;

      // Clear with fade
      ctx.fillStyle = "rgba(8, 8, 12, 0.15)";
      ctx.fillRect(0, 0, width, height);

      for (const ring of rings) {
        // Orbital movement
        const orbitAngle = tick * ring.orbitSpeed + ring.orbitOffset;
        const x = ring.x + Math.cos(orbitAngle) * ring.orbitRadius;
        const y = ring.y + Math.sin(orbitAngle) * ring.orbitRadius;

        // Pulse scale
        const pulse =
          0.9 + Math.sin(tick * ring.pulseSpeed + ring.pulseOffset) * 0.1;

        drawRing(ring, x, y, pulse);
      }

      animationId = requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = "#08080c";
    ctx.fillRect(0, 0, width, height);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [colors, count, intensity, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden bg-[#08080c]", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Ambient color wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 30% 30%, ${colors[0]}15 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, ${colors[1]}12 0%, transparent 50%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(8,8,12,0.95) 100%)",
        }}
      />

      {/* Content layer */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default function NeonBackgroundDemo() {
  return <NeonBackground />;
}
