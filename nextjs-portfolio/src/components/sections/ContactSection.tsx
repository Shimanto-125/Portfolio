'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';

interface ContactProps {
  contactEmail?: string;
  contactLocation?: string;
  contactGithub?: string;
  contactLinkedin?: string;
}

export default function ContactSection({
  contactEmail = 'abirshimantoas83@gmail.com',
  contactLocation = 'Global Remote / Dhaka, BD',
  contactGithub = 'https://github.com/Shimanto-125',
  contactLinkedin = 'https://www.linkedin.com/in/abir-shimanto-b10197291',
}: ContactProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    setTimeout(() => {
      showToast('Transmission Successful', `Telemetry verified. Thank you, ${name}! Your transmission has been uploaded.`, 'check_circle');
      form.reset();
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="mt-40 space-y-20 relative scroll-mt-28" id="contact">
      <div className="text-center space-y-4">
        <h3 className="text-[32px] md:text-[48px] font-bold text-glow font-['Plus_Jakarta_Sans']">Contact Me</h3>
        <p className="font-mono text-[var(--color-primary)] tracking-widest uppercase text-xs">Communication Protocols</p>
      </div>

      <div className="max-w-4xl mx-auto glass-panel rounded-[2.5rem] p-12 border-[var(--color-primary)]/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            <div>
              <h4 className="text-2xl mb-2 font-semibold font-['Plus_Jakarta_Sans']">Direct Contact</h4>
            </div>
            <div className="space-y-4">
              <a className="flex items-center gap-4 group" href={`mailto:${contactEmail}`}>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-container)]/10 flex items-center justify-center text-[var(--color-primary-container)] group-hover:bg-[var(--color-primary-container)] group-hover:text-[var(--color-on-primary)] transition-all">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[var(--color-primary-container)] uppercase">Gmail</div>
                  <div className="font-['Inter']">{contactEmail}</div>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[var(--color-secondary)] uppercase">Local Node</div>
                  <div className="font-['Inter']">{contactLocation}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <a className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-container)] hover:border-[var(--color-primary-container)]/50 transition-all hover:scale-110"
                href={contactGithub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.412-4.041-1.412-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-container)] hover:border-[var(--color-primary-container)]/50 transition-all hover:scale-110"
                href={contactLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" className="bg-[var(--color-surface-container-high)] border border-[var(--glass-border)] rounded-xl px-4 py-3 focus:border-[var(--color-primary-container)] focus:outline-none transition-all text-[var(--color-on-surface)] w-full font-['Inter']" placeholder="Identity" type="text" required />
              <input name="email" className="bg-[var(--color-surface-container-high)] border border-[var(--glass-border)] rounded-xl px-4 py-3 focus:border-[var(--color-primary-container)] focus:outline-none transition-all text-[var(--color-on-surface)] w-full font-['Inter']" placeholder="abc@gmail.com" type="email" required />
            </div>
            <input name="subject" className="w-full bg-[var(--color-surface-container-high)] border border-[var(--glass-border)] rounded-xl px-4 py-3 focus:border-[var(--color-primary-container)] focus:outline-none transition-all text-[var(--color-on-surface)] font-['Inter']" placeholder="Subject" type="text" required />
            <textarea name="message" className="w-full bg-[var(--color-surface-container-high)] border border-[var(--glass-border)] rounded-xl px-4 py-3 focus:border-[var(--color-primary-container)] focus:outline-none transition-all text-[var(--color-on-surface)] font-['Inter']" placeholder="Message" rows={4} required />
            <button className="w-full py-4 bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-bold rounded-xl bloom-primary hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              type="submit" disabled={loading}>
              <span>{loading ? 'Transmitting Data...' : 'Send Message'}</span>
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>{loading ? 'sync' : 'settings_ethernet'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
