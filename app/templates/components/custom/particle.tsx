"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { cn } from "~/templates/lib/utils";

export interface ParticlesProps {
  className?: string;
  children?: React.ReactNode;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  let normalized = hex.replace("#", "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = Number.parseInt(normalized, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  className,
  children,
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const animationRef = useRef<number | null>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    context.current = canvas.getContext("2d");
    if (!context.current) return;

    const resizeCanvas = () => {
      if (!canvasContainerRef.current || !canvasRef.current || !context.current) return;
      circles.current.length = 0;
      const w = canvasContainerRef.current.offsetWidth;
      const h = canvasContainerRef.current.offsetHeight;
      canvasSize.current.w = w;
      canvasSize.current.h = h;
      canvasRef.current.width = w * dpr;
      canvasRef.current.height = h * dpr;
      canvasRef.current.style.width = `${w}px`;
      canvasRef.current.style.height = `${h}px`;
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const circleParams = (): Circle => {
      const x = Math.floor(Math.random() * canvasSize.current.w);
      const y = Math.floor(Math.random() * canvasSize.current.h);
      const pSize = Math.floor(Math.random() * 2) + size;
      const targetAlpha = Number.parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: pSize,
        alpha: 0,
        targetAlpha,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        magnetism: 0.1 + Math.random() * 4,
      };
    };

    const rgb = hexToRgb(color);

    const drawCircle = (circle: Circle, update = false) => {
      if (!context.current) return;
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    };

    const clearContext = () => {
      if (context.current) {
        context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
      }
    };

    const drawParticles = () => {
      clearContext();
      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams());
      }
    };

    const remapValue = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number,
    ): number => {
      const remapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    };

    const animate = () => {
      if (!isRunning.current) return;
      clearContext();

      const { w, h } = canvasSize.current;
      for (let i = circles.current.length - 1; i >= 0; i--) {
        const circle = circles.current[i];
        const edge = [
          circle.x + circle.translateX - circle.size,
          w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = Math.min(...edge);
        const remapClosestEdge = remapValue(closestEdge, 0, 20, 0, 1);

        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha;
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY +=
          (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        drawCircle(circle, true);

        if (
          circle.x < -circle.size ||
          circle.x > w + circle.size ||
          circle.y < -circle.size ||
          circle.y > h + circle.size
        ) {
          circles.current.splice(i, 1);
          drawCircle(circleParams());
        }
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        animationRef.current = window.requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      isRunning.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Global mouse move listener updating mutable ref ONLY - ZERO React re-renders!
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle tab visibility to pause CPU/GPU completely when user switches tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // IntersectionObserver to pause when scrolled out of viewport
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

    resizeCanvas();
    drawParticles();
    startAnimation();

    const handleResize = () => {
      resizeCanvas();
      drawParticles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      stopAnimation();
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, quantity, staticity, ease, size, vx, vy, refresh]);

  return (
    <div
      ref={canvasContainerRef}
      className={cn("fixed inset-0 overflow-hidden bg-neutral-950", className)}
    >
      <canvas className="absolute inset-0 size-full" ref={canvasRef} />
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
};

Particles.displayName = "Particles";

export default function ParticlesDemo() {
  return <Particles />;
}
