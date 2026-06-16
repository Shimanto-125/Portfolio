'use client';

interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
  neural_depth?: string;
  latency?: string;
}

function SkillGroup({ category, skills }: { category: string; skills: Skill[] }) {
  return (
    <div className="glass-panel p-6 rounded-3xl border-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/40 transition-all duration-300 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
        <h4 className="text-lg text-[var(--color-primary)] tracking-wider uppercase font-semibold font-['Plus_Jakarta_Sans']">{category}</h4>
        <span className="text-[9px] font-mono text-[var(--color-outline)] opacity-60">LOAD_BALANCED</span>
      </div>
      <div className="flex flex-col gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-on-surface)] font-medium font-['Plus_Jakarta_Sans']">{skill.name}</span>
              <span className="text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">{skill.neural_depth || 'L8'}</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary-container)] skill-bar-fill rounded-full" style={{ width: `${skill.percentage}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[var(--color-on-surface-variant)] opacity-60">
              <span>SYNAPSE: {skill.percentage}%</span>
              <span>LATENCY: {skill.latency || '0.5ms'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups: Record<string, Skill[]> = {};
  skills.forEach((s) => {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  });

  const categoryKeys = Object.keys(groups);
  const leftKeys = categoryKeys.filter((_, i) => i % 2 === 0);
  const rightKeys = categoryKeys.filter((_, i) => i % 2 !== 0);

  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="skills">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Skills</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Skill Proficiency Metrics</p>
      </div>

      {/* Desktop: left | center ball | right */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_260px_1fr] gap-8 items-center">
        {/* Left skills */}
        <div className="flex flex-col gap-6">
          {leftKeys.map((cat) => (
            <SkillGroup key={cat} category={cat} skills={groups[cat]} />
          ))}
        </div>

        {/* Center neural core ball */}
        <div className="flex justify-center items-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-[80px] animate-pulse rounded-full" />
            <div className="relative w-44 h-44 rounded-full border-2 border-[var(--color-primary)]/30 flex items-center justify-center bloom-primary floating">
              <div className="w-36 h-36 rounded-full border border-[var(--color-primary)]/20 flex items-center justify-center bg-[var(--color-surface-container-low)]/50 backdrop-blur-xl">
                <span className="material-symbols-outlined text-5xl text-[var(--color-primary)] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
              </div>
              <div className="absolute -inset-4 border border-[var(--color-primary)]/10 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-8 border border-[var(--color-primary)]/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </div>
        </div>

        {/* Right skills */}
        <div className="flex flex-col gap-6">
          {rightKeys.map((cat) => (
            <SkillGroup key={cat} category={cat} skills={groups[cat]} />
          ))}
          {/* If odd number of categories, right side may be empty — fill with a decorative node count card */}
          {rightKeys.length === 0 && leftKeys.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border-[var(--color-secondary)]/15 flex flex-col gap-3 items-center justify-center min-h-[120px]">
              <span className="material-symbols-outlined text-3xl text-[var(--color-secondary)] animate-pulse">hub</span>
              <span className="text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-widest">Neural Core Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-6 lg:hidden">
        {categoryKeys.map((cat) => (
          <SkillGroup key={cat} category={cat} skills={groups[cat]} />
        ))}
        {/* Mobile ball at bottom */}
        <div className="flex justify-center items-center py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-[60px] animate-pulse rounded-full" />
            <div className="relative w-32 h-32 rounded-full border-2 border-[var(--color-primary)]/30 flex items-center justify-center bloom-primary floating">
              <div className="w-24 h-24 rounded-full border border-[var(--color-primary)]/20 flex items-center justify-center bg-[var(--color-surface-container-low)]/50 backdrop-blur-xl">
                <span className="material-symbols-outlined text-4xl text-[var(--color-primary)] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
              </div>
              <div className="absolute -inset-3 border border-[var(--color-primary)]/10 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
