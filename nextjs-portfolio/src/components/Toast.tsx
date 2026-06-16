'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  title: string;
  message: string;
  icon: string;
}

interface ToastContextType {
  showToast: (title: string, message: string, icon?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((title: string, message: string, icon = 'notifications') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, title, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-panel p-4 rounded-xl flex items-start gap-3 shadow-lg pointer-events-auto min-w-[280px] max-w-[350px] animate-slide-in-right"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
              <span className="material-symbols-outlined text-lg">{toast.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-[var(--color-primary)] uppercase font-bold tracking-wider truncate">
                {toast.title}
              </div>
              <div className="text-xs mt-1 leading-normal text-[var(--color-on-surface)]">
                {toast.message}
              </div>
            </div>
            <button
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
              onClick={() => dismiss(toast.id)}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
