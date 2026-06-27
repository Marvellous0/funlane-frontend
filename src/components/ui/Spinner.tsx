import type { CSSProperties } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE: Record<SpinnerSize, string> = {
  xs: 'w-3.5 h-3.5 border-[2px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-9 h-9 border-[3px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  /** Any CSS color value. Falls back to currentColor so it inherits text color. */
  color?: string;
  className?: string;
}

/**
 * Reusable animated spinner. The ring is drawn with a transparent top border so
 * it reads as a spinning arc; color inherits from `currentColor` unless `color`
 * is passed, which lets it sit inside buttons of any tone.
 */
export function Spinner({ size = 'md', color, className = '' }: SpinnerProps) {
  const style: CSSProperties = { borderTopColor: 'transparent' };
  if (color) style.color = color;
  return (
    <span
      role="status"
      aria-label="Loading"
      style={style}
      className={`inline-block rounded-full border-current animate-spin align-[-0.125em] ${SIZE[size]} ${className}`}
    />
  );
}

interface LoaderProps {
  label?: string;
  size?: SpinnerSize;
  className?: string;
}

/**
 * Centered spinner + optional caption — the drop-in replacement for the
 * plain "Loading…" text blocks scattered across the dashboards.
 */
export function Loader({ label = 'Loading…', size = 'md', className = '' }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 text-ink-3 ${className}`}>
      <Spinner size={size} className="text-brand" />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </div>
  );
}
