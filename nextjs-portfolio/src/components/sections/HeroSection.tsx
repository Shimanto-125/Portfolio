'use client';

import { useEffect, useRef, useState } from 'react';

interface CompetitiveProfile {
  id: string | number;
  platform: string;
  username: string;
  profile_url: string;
  problems_solved: number;
  rank: string;
  rating: number;
  display_order: number;
  is_visible: boolean;
}

interface Props {
  heroRole: string;
  heroSubRole: string;
  cvUrl: string;
  heroGreeting?: string;
  heroDescription?: string;
  heroPrimaryBtn?: string;
  heroSecondaryBtn?: string;
  heroImageUrl?: string;
  competitiveProfiles?: CompetitiveProfile[];
  socialGithub?: string;
  socialLinkedin?: string;
  socialEmail?: string;
}

// Typewriter component: supports comma-separated cycling texts
function TypingText({ text, className }: { text: string; className?: string }) {
  const texts = text.split(',').map(t => t.trim()).filter(Boolean);
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[idx];

    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, 2200);
      return () => clearTimeout(t);
    }
    if (!deleting && display.length < current.length) {
      const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 75);
      return () => clearTimeout(t);
    }
    if (!deleting && display.length === current.length) {
      setPaused(true);
      return;
    }
    if (deleting && display.length > 0) {
      const t = setTimeout(() => setDisplay(prev => prev.slice(0, -1)), 38);
      return () => clearTimeout(t);
    }
    if (deleting && display.length === 0) {
      setDeleting(false);
      setIdx(prev => (prev + 1) % texts.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, deleting, paused, idx]);

  return (
    <span className={className}>
      {display}
      <span className="animate-pulse opacity-70">|</span>
    </span>
  );
}

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const cls = className || 'w-5 h-5';
  if (platform === 'codeforces') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5zm9-4.5C14.328 3 15 3.672 15 4.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5zm9 4.5C23.328 7.5 24 8.172 24 9v10.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5z" />
    </svg>
  );
  if (platform === 'leetcode') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 2C9.79 2 8 3.79 8 6c0 .9.3 1.73.8 2.4A3.5 3.5 0 0 0 6 11.5V13h12v-1.5A3.5 3.5 0 0 0 15.2 8.4C15.7 7.73 16 6.9 16 6c0-2.21-1.79-4-4-4zM6 14v4.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V14H6z" />
    </svg>
  );
}

const PLATFORM_META: Record<string, {
  label: string;
  iconColor: string;
  gradient: string;
  hoverGradient: string;
  hoverBorder: string;
}> = {
  codeforces: {
    label: 'Codeforces',
    iconColor: 'text-[var(--color-primary-container)]',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    hoverGradient: 'group-hover:from-blue-500/40 group-hover:to-cyan-500/20',
    hoverBorder: 'hover:border-[var(--color-primary-container)]/80',
  },
  leetcode: {
    label: 'LeetCode',
    iconColor: 'text-[var(--color-secondary)]',
    gradient: 'from-yellow-500/20 to-orange-500/10',
    hoverGradient: 'group-hover:from-yellow-500/40 group-hover:to-orange-500/20',
    hoverBorder: 'hover:border-[var(--color-secondary)]/80',
  },
  codechef: {
    label: 'CodeChef',
    iconColor: 'text-[var(--color-tertiary)]',
    gradient: 'from-orange-500/20 to-red-500/10',
    hoverGradient: 'group-hover:from-orange-500/40 group-hover:to-red-500/20',
    hoverBorder: 'hover:border-[var(--color-tertiary)]/80',
  },
};

const BADGE_POSITIONS = [
  { pos: 'absolute top-[15%] left-[calc(100%-1.5rem)]', expandDir: 'right', animDelay: undefined },
  { pos: 'absolute top-[45%] right-[calc(100%-1.5rem)]', expandDir: 'left', animDelay: '1s' },
  { pos: 'absolute bottom-[15%] left-[calc(100%-1.5rem)]', expandDir: 'right', animDelay: '2s' },
];

function statLine(p: CompetitiveProfile): string {
  if (p.problems_solved > 0 && p.rank) return `${p.problems_solved} solved · ${p.rank}`;
  if (p.problems_solved > 0) return `${p.problems_solved} solved`;
  if (p.rank) return p.rank;
  return `@${p.username}`;
}

export default function HeroSection({
  heroRole, heroSubRole, cvUrl,
  heroGreeting, heroDescription, heroPrimaryBtn, heroSecondaryBtn,
  heroImageUrl,
  competitiveProfiles = [],
  socialGithub = 'https://github.com/Shimanto-125',
  socialLinkedin = 'https://www.linkedin.com/in/abir-shimanto-b10197291',
  socialEmail = 'abirshimantoas83@gmail.com',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.add('visible');
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const visibleProfiles = [...competitiveProfiles]
    .filter(p => p.is_visible)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] section-reveal"
      id="hero"
    >
      {/* LEFT: IDENTITY */}
      <div className="relative space-y-4">
        <div className="space-y-2">
          <h1 className="text-[26px] md:text-[38px] leading-tight font-bold text-glow font-['Plus_Jakarta_Sans']"
            dangerouslySetInnerHTML={{ __html: heroGreeting || `Hey, I'm <br />\n<span class="text-[var(--color-primary-container)]">Md. Abir Shimanto 👋</span>` }}
          />
          <h2 className="text-[18px] font-semibold text-[var(--color-on-surface-variant)] opacity-80 italic font-['Plus_Jakarta_Sans']">
            {heroRole}
          </h2>
          {/* Typewriter cycling animation */}
          <h3 className="text-[16px] font-medium text-[var(--color-primary)] opacity-90 font-['Plus_Jakarta_Sans'] min-h-[1.5em]">
            <TypingText text={heroSubRole} />
          </h3>
        </div>
        <div className="space-y-4 max-w-md">
          <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed font-['Inter']"
            dangerouslySetInnerHTML={{ __html: heroDescription || `🚀 Empowering future innovators through machine learning and AI ✨ <br />\n| Available for projects, research and collaborations 🤝` }}
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={scrollToContact}
            className="px-6 py-2.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-xl bloom-primary hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 text-sm cursor-pointer"
          >
            <span>{heroPrimaryBtn || 'Say Hello'}</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>
          <button
            onClick={() => { if (cvUrl && cvUrl !== '#') window.open(cvUrl, '_blunk'); }}
            className="px-6 py-2.5 glass-panel text-[var(--color-on-surface)] border border-[var(--color-primary)]/20 rounded-xl hover:bg-[var(--color-primary)]/10 transition-all duration-300 flex items-center gap-2 text-sm cursor-pointer"
          >
            <span>{heroSecondaryBtn || 'Download CV'}</span>
            <span className="material-symbols-outlined text-base">download</span>
          </button>
        </div>

        {/* Social sidebar */}
        <div className="absolute -left-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <a className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center hover:text-[var(--color-primary-container)] hover:border-[var(--color-primary)]/40 transition-all hover:scale-110"
            href={socialGithub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          </a>
          <a className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center hover:text-[var(--color-primary-container)] hover:border-[var(--color-primary)]/40 transition-all hover:scale-110"
            href={socialLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
          <a className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center hover:text-[var(--color-primary-container)] hover:border-[var(--color-primary)]/40 transition-all hover:scale-110"
            href={`mailto:${socialEmail}`} aria-label="Gmail">
            <span className="material-symbols-outlined text-xl">mail</span>
          </a>
        </div>
      </div>

      {/* RIGHT: VISUAL */}
      <div className="relative flex flex-col justify-center items-center">
        <div className="relative w-60 h-60 md:w-[340px] md:h-[340px]">
          <div className="absolute inset-0 organic-blob bg-gradient-to-tr from-[var(--color-primary)]/20 via-transparent to-[var(--color-secondary)]/20 border-2 border-[var(--color-primary)]/30 bloom-primary" />
          <div className="absolute inset-4 organic-blob overflow-hidden bg-[var(--color-surface-container-low)] border border-[var(--glass-border)]">
            <img alt="Md. Abir Shimanto Portfolio" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" src={heroImageUrl || '/profile.jpg'} />
          </div>

          {/* Neural SVG lines (Desktop only) */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ filter: 'drop-shadow(0 0 10px rgba(125, 216, 255, 0.2))' }}>
            <line className="neural-line" x1="50%" y1="50%" x2="95%" y2="20%" />
            <line className="neural-line" x1="50%" y1="50%" x2="5%" y2="50%" />
            <line className="neural-line" x1="50%" y1="50%" x2="95%" y2="80%" />
          </svg>

          {/* CP Badges (Desktop only) */}
          {visibleProfiles.map((profile, index) => {
            const badgePos = BADGE_POSITIONS[index];
            if (!badgePos) return null;
            const meta = PLATFORM_META[profile.platform];
            if (!meta) return null;
            const isRight = badgePos.expandDir === 'right';
            const baseClass = `hidden md:flex ${badgePos.pos} w-12 h-12 hover:w-48 glass-panel rounded-full items-center p-1.5 group ${meta.hoverBorder} transition-all duration-500 ease-in-out ml-hover-glow floating cursor-pointer z-10 overflow-hidden`;
            return (
              <a key={profile.id} href={profile.profile_url} target="_blank" rel="noopener noreferrer"
                className={isRight ? baseClass : `${baseClass} justify-end`}
                style={badgePos.animDelay ? { animationDelay: badgePos.animDelay } : undefined}>
                {isRight ? (
                  <>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${meta.gradient} ${meta.hoverGradient} flex items-center justify-center ${meta.iconColor} transition-all neuron-node shrink-0`}>
                      <PlatformIcon platform={profile.platform} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col justify-center pl-3 whitespace-nowrap">
                      <div className="text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-none text-[var(--color-on-surface)]">{meta.label}</div>
                      <div className="text-[8px] text-[var(--color-on-surface-variant)] uppercase tracking-wider leading-none font-mono mt-1">{statLine(profile)}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col items-end justify-center pr-3 whitespace-nowrap">
                      <div className="text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-none text-[var(--color-on-surface)]">{meta.label}</div>
                      <div className="text-[8px] text-[var(--color-on-surface-variant)] uppercase tracking-wider leading-none font-mono mt-1">{statLine(profile)}</div>
                    </div>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${meta.gradient} ${meta.hoverGradient} flex items-center justify-center ${meta.iconColor} transition-all neuron-node shrink-0`}>
                      <PlatformIcon platform={profile.platform} />
                    </div>
                  </>
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile CP Links */}
        <div className="flex flex-wrap justify-center gap-3 md:hidden mt-8 w-full px-4">
          {visibleProfiles.map(profile => {
            const meta = PLATFORM_META[profile.platform];
            if (!meta) return null;
            const stat = statLine(profile);
            const showStat = profile.problems_solved > 0 || profile.rank;
            return (
              <a key={profile.id} href={profile.profile_url} target="_blank" rel="noopener noreferrer"
                className={`glass-panel px-3 py-2 rounded-xl flex items-center gap-2 group ${meta.hoverBorder} transition-all text-xs font-semibold ml-hover-glow cursor-pointer`}>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center ${meta.iconColor} shrink-0`}>
                  <PlatformIcon platform={profile.platform} className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span>{meta.label}</span>
                  {showStat && <span className="text-[9px] text-[var(--color-on-surface-variant)] font-mono leading-tight">{stat}</span>}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
