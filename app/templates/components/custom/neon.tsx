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
  count = 5,
  intensity = 1,
  speed = 1,
}: NeonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRunning = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let tick = 0;

    const createRings = (): NeonRing[] => {
      const rings: NeonRing[] = [];
      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);
      const scale = minDim / 800;

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

    const handleResize = () => {
      rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      rings = createRings();
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Optimized glowing ring drawing: single soft glow pass + clean core
    const drawRing = (ring: NeonRing, x: number, y: number, scale: number) => {
      const radius = ring.radius * scale;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.lineWidth * 4 * intensity;
      ctx.globalAlpha = 0.25;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 16 * intensity;
      ctx.stroke();

      // Sharp Core
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.lineWidth = ring.lineWidth * 1.5;
      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 4 * intensity;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      if (!isRunning.current) return;
      tick += speed;

      ctx.fillStyle = "rgba(8, 8, 12, 0.18)";
      ctx.fillRect(0, 0, width, height);

      for (const ring of rings) {
        const orbitAngle = tick * ring.orbitSpeed + ring.orbitOffset;
        const x = ring.x + Math.cos(orbitAngle) * ring.orbitRadius;
        const y = ring.y + Math.sin(orbitAngle) * ring.orbitRadius;
        const pulse =
          0.9 + Math.sin(tick * ring.pulseSpeed + ring.pulseOffset) * 0.1;

        drawRing(ring, x, y, pulse);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      isRunning.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pause when hero is scrolled out of view!
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    ctx.fillStyle = "#08080c";
    ctx.fillRect(0, 0, width, height);
    startAnimation();

    return () => {
      stopAnimation();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default function NeonBackgroundDemo() {
  return <NeonBackground />;
}
