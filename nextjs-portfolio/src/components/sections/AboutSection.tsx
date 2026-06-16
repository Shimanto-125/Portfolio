'use client';

import { resolveImageUrl } from '@/lib/constants';

interface AboutProps {
  aboutImageUrl?: string;
  aboutBio?: string;
  aboutExperience?: string;
  aboutProjectsLabel?: string;
  aboutTechDesc?: string;
  isAvailable?: string;
}

export default function AboutSection({
  aboutImageUrl,
  aboutBio,
  aboutExperience,
  aboutProjectsLabel,
  aboutTechDesc,
  isAvailable = 'true',
}: AboutProps) {
  const imgSrc = resolveImageUrl(aboutImageUrl || '');
  const bio = aboutBio || 'I am a machine learning architect and trainer specializing in high-performance neural computation and intelligent digital ecosystems. I bridge brutal backend efficiency with state-of-the-art AI networks, creating resilient systems that scale and adapt.';
  const experience = aboutExperience || '3+ Years Professional AI/ML Engineering & Training';
  const projectsLabel = aboutProjectsLabel || '150+ Nodes';
  const techDesc = aboutTechDesc || 'Core Engine: TensorFlow, PyTorch, React, Node.js, and Docker.';

  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="about">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">About Me</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">My Introduction</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bio Image */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-4 bg-[var(--color-primary)]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative rounded-[2rem] overflow-hidden border border-[var(--glass-border)] glass-panel">
            {imgSrc ? (
              <img
                alt="About section image"
                className="w-full aspect-[4/5] object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                src={imgSrc}
              />
            ) : (
              <div className="w-full aspect-[4/5] flex items-center justify-center bg-[var(--color-surface-container)]">
                <span className="material-symbols-outlined text-6xl text-[var(--color-primary)]/30">image</span>
              </div>
            )}
          </div>
        </div>
        {/* Bio Content */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl space-y-4 border-[var(--color-primary)]/10">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">psychology</span>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-lg font-['Inter']">{bio}</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl space-y-2 border-[var(--color-secondary)]/10 group hover:bg-[var(--color-secondary)]/5 transition-all">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[var(--color-secondary)]">verified_user</span>
              <span className="text-[10px] font-mono text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-full uppercase">
                Status: {isAvailable === 'true' ? 'Available' : 'Busy'}
              </span>
            </div>
            <h4 className="text-lg font-semibold font-['Plus_Jakarta_Sans']">Experience</h4>
            <p className="text-sm text-[var(--color-on-surface-variant)] font-['Inter']">{experience}</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl space-y-2 border-[var(--color-tertiary)]/10 group hover:bg-[var(--color-tertiary)]/5 transition-all">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[var(--color-tertiary)]">rocket_launch</span>
              <span className="text-[10px] font-mono text-[var(--color-tertiary)] bg-[var(--color-tertiary)]/10 px-2 py-0.5 rounded-full uppercase">{projectsLabel}</span>
            </div>
            <h4 className="text-lg font-semibold font-['Plus_Jakarta_Sans']">Completed</h4>
            <p className="text-sm text-[var(--color-on-surface-variant)] font-['Inter']">Production AI pipelines &amp; Full-Stack Apps</p>
          </div>
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl flex flex-wrap items-center gap-4 border-[var(--color-primary)]/5">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-surface-dim)] bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">PY</div>
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-surface-dim)] bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[10px] font-bold text-[var(--color-secondary)]">JS</div>
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-surface-dim)] bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[10px] font-bold text-[var(--color-tertiary)]">TS</div>
            </div>
            <p className="font-mono text-xs text-[var(--color-on-surface-variant)]">{techDesc}</p>
            <button onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="ml-auto text-[var(--color-primary)] text-sm font-bold flex items-center gap-2 group cursor-pointer">
              Full Stack Trace <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
