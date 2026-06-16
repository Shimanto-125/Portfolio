'use client';

interface Education {
  id: string;
  institution: string;
  degree: string;
  department?: string;
  duration: string;
  grade?: string;
  description?: string;
}

export default function EducationSection({ items }: { items: Education[] }) {
  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="education">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Education</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Academic Foundation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="glass-panel p-8 rounded-3xl border-[var(--color-primary)]/10 group hover:bg-[var(--color-primary)]/5 transition-all duration-500 flex gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300 bloom-primary flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full uppercase">{item.grade || 'GRADUATE'}</span>
                <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{item.duration}</span>
              </div>
              <h4 className="text-xl font-semibold font-['Plus_Jakarta_Sans']">{item.degree}</h4>
              <p className="text-sm text-[var(--color-primary-container)] font-semibold font-['Inter']">{item.institution}</p>
              {item.department && <p className="text-xs text-[var(--color-on-surface-variant)]/80">Department: {item.department}</p>}
              {item.description && <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mt-2 font-['Inter']">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
