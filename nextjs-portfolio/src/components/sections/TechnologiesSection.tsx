'use client';

import { TECH_STACK } from '@/lib/constants';

interface TechItem {
  id?: string | number;
  name: string;
  label?: string;
  icon?: string;
  type: string;
}

interface Props {
  items?: TechItem[];
}

export default function TechnologiesSection({ items }: Props) {
  const stack = (items && items.length > 0) ? items : TECH_STACK;

  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="technologies">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Technologies</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">My Tech Stack</p>
      </div>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
        {stack.map((tech) => (
          <div key={(tech as TechItem).id ?? tech.name} className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full glass-panel border border-[var(--color-primary)]/20 flex items-center justify-center group-hover:border-[var(--color-primary)] group-hover:scale-110 transition-all duration-300 bloom-primary">
              {tech.type === 'text' ? (
                <span className="text-xl font-bold text-[var(--color-primary)]">{tech.label}</span>
              ) : (
                <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">{tech.icon}</span>
              )}
            </div>
            <span className="font-mono text-xs text-[var(--color-on-surface-variant)]">{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
