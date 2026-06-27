import type { ElementType, ReactNode } from 'react';

interface PageHeaderProps {
  /** Small uppercase label shown in a pill above the title. */
  eyebrow?: string;
  eyebrowIcon?: ElementType;
  title: string;
  subtitle?: string;
  /** Right-aligned content — stats, buttons, etc. */
  actions?: ReactNode;
  /**
   * `gradient` (default) — bold branded banner for the landing page of each role.
   * `plain` — lightweight title block for sub-pages so the banner doesn't fatigue.
   */
  variant?: 'gradient' | 'plain';
}

/**
 * Reusable page header shared across every dashboard. Use the `gradient` variant
 * on role landing pages and the `plain` variant on sub-pages — same component,
 * consistent typography, different weight.
 */
export function PageHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  actions,
  variant = 'gradient',
}: PageHeaderProps) {
  if (variant === 'plain') {
    return (
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          {eyebrow ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3 bg-surface border border-line px-2.5 py-1 rounded-full">
              {EyebrowIcon ? <EyebrowIcon className="w-3.5 h-3.5" aria-hidden="true" /> : null}
              {eyebrow}
            </span>
          ) : null}
          <h1 className={`text-2xl font-bold text-ink ${eyebrow ? 'mt-2.5' : ''}`}>{title}</h1>
          {subtitle ? <p className="text-ink-3 text-sm mt-1 max-w-md">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-3 self-start sm:self-end">{actions}</div> : null}
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-ink to-brand-dark text-white p-6 sm:p-8 shadow-card">
      <div aria-hidden="true" className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/5" />
      <div aria-hidden="true" className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-white/5" />
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          {eyebrow ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
              {EyebrowIcon ? <EyebrowIcon className="w-3.5 h-3.5" aria-hidden="true" /> : null}
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-3xl font-bold mt-3">{title}</h1>
          {subtitle ? <p className="text-white/60 text-sm mt-1.5 max-w-md">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-6">{actions}</div> : null}
      </div>
    </header>
  );
}
