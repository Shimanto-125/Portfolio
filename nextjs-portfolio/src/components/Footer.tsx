interface FooterProps {
  footerTitle?: string;
  footerName?: string;
}

export default function Footer({ footerTitle = 'ML Trainer', footerName = 'Abir Shimanto' }: FooterProps) {
  return (
    <footer className="w-full py-12 px-6 md:px-16 border-t border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-dim)] mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-mono text-[var(--color-primary)] tracking-widest font-semibold text-xs">{footerTitle}</div>
          <div className="font-mono text-xs text-[var(--color-outline)] opacity-60">© 2026 {footerName}: OPTIMIZED</div>
        </div>
        <div className="flex items-center">
          <a href="/admin" className="font-mono text-xs text-[var(--color-outline)] opacity-40 hover:opacity-100 hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-[10px]">admin_panel_settings</span>
            Admin Access
          </a>
        </div>
      </div>
    </footer>
  );
}
