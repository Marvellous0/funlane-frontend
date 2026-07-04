'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type DrawerWidth = 'sm' | 'md' | 'lg' | 'xl';

/**
 * - `right` — side panel anchored to the right edge (default).
 * - `bottom` — sheet that slides up from the bottom.
 * - `responsive` — bottom sheet on mobile, right panel on desktop.
 */
type DrawerSide = 'right' | 'bottom' | 'responsive';

const WIDTH: Record<DrawerWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Optional sub-line under the title. */
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: DrawerWidth;
  side?: DrawerSide;
}

export function Drawer({ open, onClose, title, description, children, footer, width = 'md', side = 'right' }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const asSheet = side === 'bottom' || (side === 'responsive' && isMobile);
  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Two-phase open/close so the transform can transition in both directions.
  useEffect(() => {
    if (open) {
      setRender(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setRender(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  // Lock background scroll whenever the drawer is in the DOM.
  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Move focus into the panel once it's shown.
  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  if (!render || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`absolute flex flex-col bg-card shadow-lg outline-none transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          asSheet
            ? `inset-x-0 bottom-0 w-full max-h-[88vh] rounded-t-2xl ${visible ? 'translate-y-0' : 'translate-y-full'}`
            : `inset-y-0 right-0 w-full ${WIDTH[width]} ${visible ? 'translate-x-0' : 'translate-x-full'}`
        }`}
      >
        {/* Grab handle (bottom sheet only) */}
        {asSheet && (
          <div className="pt-3 pb-1 flex justify-center shrink-0" aria-hidden="true">
            <span className="h-1.5 w-10 rounded-full bg-line" />
          </div>
        )}

        {/* Header */}
        <div className={`flex items-start justify-between gap-3 px-6 border-b border-line ${asSheet ? 'py-4' : 'py-5'}`}>
          <div className="min-w-0">
            <div className="text-lg font-semibold text-ink">{title}</div>
            {description && <div className="text-sm text-ink-3 mt-0.5">{description}</div>}
          </div>
          <button
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-ink-3 hover:bg-surface hover:text-ink transition-colors"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {/* Footer */}
        {footer ? <div className="px-6 py-4 bg-surface border-t border-line">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
