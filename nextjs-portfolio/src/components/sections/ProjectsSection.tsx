'use client';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  tags?: string[];
  github_url?: string;
  live_url?: string;
}

const ACCENT_COLORS = [
  { name: 'primary', var: '--color-primary', containerVar: '--color-primary-container', onVar: '--color-on-primary' },
  { name: 'secondary', var: '--color-secondary', containerVar: '--color-secondary-container', onVar: '--color-on-secondary' },
  { name: 'tertiary', var: '--color-tertiary', containerVar: '--color-tertiary-container', onVar: '--color-on-tertiary' },
];

export default function ProjectsSection({ items }: { items: Project[] }) {
  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="projects">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Projects</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Recent Projects</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => {
          const accent = ACCENT_COLORS[idx % 3];
          return (
            <div key={item.id} className="glass-panel rounded-3xl overflow-hidden border border-[var(--glass-border)] group hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between"
              style={{ ['--accent' as string]: `var(${accent.var})`, ['--accent-container' as string]: `var(${accent.containerVar})` }}>
              <div>
                {item.image_url && (
                  <div className="aspect-video overflow-hidden relative">
                    <img alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" src={item.image_url} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dim)] to-transparent opacity-60" />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-bold font-['Plus_Jakarta_Sans']" style={{ color: `var(${accent.containerVar})` }}>{item.title}</h4>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-3 font-['Inter']">{item.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(item.tags || []).map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-mono"
                        style={{ background: `color-mix(in srgb, var(${accent.var}) 10%, transparent)`, border: `1px solid color-mix(in srgb, var(${accent.var}) 20%, transparent)`, color: `var(${accent.var})` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 flex gap-3">
                {item.github_url && (
                  <a className="flex-1 py-2 glass-panel border border-[var(--glass-border)] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-on-surface)]/5 transition-all"
                    href={item.github_url} target="_blank" rel="noopener noreferrer">
                    <span className="material-symbols-outlined text-sm">code</span> GitHub
                  </a>
                )}
                {item.live_url && (
                  <a className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all text-center"
                    style={{ background: `var(${accent.containerVar})`, color: `var(${accent.onVar})` }}
                    href={item.live_url} target="_blank" rel="noopener noreferrer">
                    <span className="material-symbols-outlined text-sm">rocket_launch</span> Live Demo
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
