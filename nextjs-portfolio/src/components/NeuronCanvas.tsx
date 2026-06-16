'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };
    const maxParticles = Math.min(80, Math.floor((width * height) / 18000));
    const connectionDistance = 120;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      colorIdx: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.colorIdx = Math.random() > 0.5 ? 0 : 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.2;
            this.y += Math.sin(angle) * force * 1.2;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const colors = isDark
          ? ['rgba(125, 216, 255, 0.6)', 'rgba(196, 170, 255, 0.6)']
          : ['rgba(0, 112, 160, 0.5)', 'rgba(91, 31, 173, 0.5)'];
        ctx.fillStyle = colors[this.colorIdx];
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseOut = () => { mouse.x = null; mouse.y = null; };
    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('resize', onResize);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx, isDark);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(125, 216, 255, ${alpha})`
              : `rgba(0, 112, 160, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('resize', onResize);
    };
  }, [resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" id="bg-orbs">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: isDark ? 0.35 : 0.08 }}
      />
      {/* Gradient orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full blur-[140px]"
        style={{ background: isDark ? 'rgba(125,216,255,0.08)' : 'rgba(0,112,160,0.06)' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[140px]"
        style={{ background: isDark ? 'rgba(196,170,255,0.10)' : 'rgba(91,31,173,0.06)' }} />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full blur-[100px]"
        style={{ background: isDark ? 'rgba(255,208,128,0.06)' : 'rgba(146,80,10,0.04)' }} />
    </div>
  );
}
