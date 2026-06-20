'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollProgressTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Slight delay to ensure DOM is fully rendered before calculating heights
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // The line stretches down as you scroll
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          }
        });

        // The icon travels exactly the distance of the track height minus its own height
        gsap.to(iconRef.current, {
          y: () => (trackRef.current?.offsetHeight || 0) - (iconRef.current?.offsetHeight || 0),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          }
        });
      }, trackRef);
      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      ref={trackRef} 
      // Position it centrally, starting below the hero content.
      // We start it roughly at 85vh and it runs to the bottom of the relative container.
      className="absolute top-[85vh] bottom-8 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none z-0 hidden md:block"
    >
      {/* Faint background track */}
      <div className="absolute inset-0 bg-[var(--color-primary)]/20" />
      
      {/* Active scrolling line */}
      <div 
        ref={lineRef} 
        className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] origin-top scale-y-0 drop-shadow-[0_0_8px_var(--color-primary)]" 
      />
      
      {/* The moving icon */}
      <div 
        ref={iconRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer bg-[var(--color-surface)]/40 backdrop-blur-md p-3 rounded-2xl border border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] text-[var(--color-primary)] hover:-translate-y-1"
        >
          <span className="material-symbols-outlined animate-bounce">mouse</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Scroll Down</span>
        </button>
      </div>
    </div>
  );
}
