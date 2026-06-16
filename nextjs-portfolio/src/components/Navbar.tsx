'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { NAV_LINKS } from '@/lib/constants';
import { useToast } from './Toast';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { showToast } = useToast();

  useEffect(() => { setMounted(true); }, []);

  // IntersectionObserver for active nav link
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(
      'System Protocol',
      next === 'dark' ? 'Dark mode parameters loaded.' : 'Light mode parameters loaded.',
      next === 'dark' ? 'dark_mode' : 'light_mode'
    );
  };

  return (
    <>
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] glass-panel backdrop-blur-xl rounded-full px-5 md:px-7 py-1.5 shadow-[0_0_40px_var(--nav-shadow)] z-50 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[var(--color-primary-container)] rounded-md flex items-center justify-center text-[var(--color-on-primary)] font-bold text-xs transition-transform group-hover:scale-105">
            AS
          </div>
          <span className="font-mono text-[var(--color-primary)] tracking-widest uppercase font-semibold text-xs hidden sm:inline-block">
            Abir Shimanto
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeSection === link.href.replace('#', '')
                  ? 'text-[var(--color-primary-container)] font-bold border-b-2 border-[var(--color-primary-container)] pb-1'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[var(--color-primary-container)] hover:text-[var(--color-primary)] transition-all duration-300 group relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl text-glow">
                {resolvedTheme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
              <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[var(--color-primary-container)] hover:text-[var(--color-primary)] transition-all duration-300 relative group cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-2xl z-[60] md:hidden flex flex-col justify-center items-center gap-8 transition-transform duration-500 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="text-[var(--color-on-surface-variant)] font-medium text-2xl hover:text-[var(--color-primary)] transition-all duration-300 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
          className="absolute top-8 right-8 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[var(--color-primary-container)] hover:text-[var(--color-primary)] transition-all duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
    </>
  );
}
