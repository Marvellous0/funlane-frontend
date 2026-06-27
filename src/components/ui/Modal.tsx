'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: '' | 'lg';
}

export function Modal({ open, title, onClose, children, footer, size = '' }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock background scroll while the dialog is open and restore on close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Portal to <body> so the overlay escapes any ancestor stacking context
  // (e.g. the dashboard `<main>`) and reliably covers the entire viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />

      {/* Container */}
      <div
        className={`relative bg-white rounded-2xl shadow-lg animate-scale-in overflow-hidden w-full ${
          size === 'lg' ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-3 hover:bg-surface hover:text-ink transition-colors"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer ? <div className="px-6 py-4 bg-surface border-t border-line">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
