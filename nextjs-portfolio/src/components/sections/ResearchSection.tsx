'use client';

interface Research {
  id: string;
  title: string;
  authors: string;
  publisher?: string;
  year?: string;
  link?: string;
  pdf_url?: string;
  image_url?: string;
}

export default function ResearchSection({ items }: { items: Research[] }) {
  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="researches">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Research</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Academic &amp; Technical Explorations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-3xl border-[var(--color-primary)]/10 group hover:bg-[var(--color-primary)]/5 transition-all duration-500 flex flex-col justify-between gap-6">
            <div>
              {item.image_url && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative border border-[var(--glass-border)]">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full uppercase">{item.publisher || 'Research'}</span>
                  <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{item.year || '2026'}</span>
                </div>
                <h4 className="text-xl font-semibold text-glow-hover transition-colors line-clamp-2 font-['Plus_Jakarta_Sans']">{item.title}</h4>
                <p className="text-xs text-[var(--color-secondary)]/80 font-medium">Authors: {item.authors}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-auto">
              {item.pdf_url && (
                <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 glass-panel border border-[var(--color-primary)]/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 transition-all text-center">
                  <span className="material-symbols-outlined text-sm">description</span> Read Paper
                </a>
              )}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 glass-panel border border-[var(--color-secondary)]/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/40 transition-all text-center">
                  <span className="material-symbols-outlined text-sm">open_in_new</span> View Details
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
