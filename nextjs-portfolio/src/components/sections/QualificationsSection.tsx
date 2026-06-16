'use client';

interface Qualification {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  duration: string;
}

export default function QualificationsSection({ items }: { items: Qualification[] }) {
  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="qualifications">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Qualifications</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Academic &amp; Professional Milestones</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="glass-panel p-8 rounded-3xl border-[var(--color-secondary)]/10 group hover:bg-[var(--color-secondary)]/5 transition-all duration-500 flex gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] group-hover:scale-110 transition-transform duration-300 flex-shrink-0" style={{ boxShadow: '0 0 10px rgba(192,193,255,0.3)' }}>
              <span className="material-symbols-outlined text-3xl">{item.type === 'Degree' ? 'school' : 'workspace_premium'}</span>
            </div>
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-full uppercase">{item.type}</span>
                <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{item.duration}</span>
              </div>
              <h4 className="text-xl font-semibold font-['Plus_Jakarta_Sans']">{item.title}</h4>
              <p className="text-sm text-[var(--color-on-surface-variant)] font-['Inter']">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
