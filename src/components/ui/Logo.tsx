import type { CSSProperties } from 'react';

/**
 * Funlane brand mark — a stylised globe with an airplane crossing it.
 * Self-contained (azure disc + white detail) so it reads on light or dark
 * backgrounds. Recreated as an SVG so it stays crisp at any size.
 */
export function FunlaneMark({ className = 'w-9 h-9', title = 'Funlane' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="funlaneGlobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3AA0DC" />
          <stop offset="1" stopColor="#1670B5" />
        </linearGradient>
        <clipPath id="funlaneGlobeClip">
          <circle cx="20" cy="20" r="16" />
        </clipPath>
      </defs>

      {/* Globe disc */}
      <circle cx="20" cy="20" r="16" fill="url(#funlaneGlobe)" />

      {/* Grid lines */}
      <g clipPath="url(#funlaneGlobeClip)" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1" fill="none">
        {/* Parallels */}
        <line x1="4" y1="13" x2="36" y2="13" />
        <line x1="4" y1="20" x2="36" y2="20" />
        <line x1="4" y1="27" x2="36" y2="27" />
        {/* Meridians */}
        <ellipse cx="20" cy="20" rx="6" ry="16" />
        <ellipse cx="20" cy="20" rx="12.5" ry="16" />
        <line x1="20" y1="4" x2="20" y2="36" />
      </g>

      {/* Airplane crossing the globe, heading up-right */}
      <g transform="translate(16 13.5) rotate(22) scale(0.6) translate(-12 -12)">
        <path
          d="M12 1 L12.9 3.6 L13.1 7.9 L22 12.6 L22 14.5 L13.1 11.4 L12.9 18.2 L16 21.2 L16 22.8 L12 20.8 L8 22.8 L8 21.2 L11.1 18.2 L10.9 11.4 L2 14.5 L2 12.6 L10.9 7.9 L11.1 3.6 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

interface FunlaneLogoProps {
  /** 'light' = white wordmark (for dark backgrounds); 'dark' = ink wordmark (for light backgrounds). */
  tone?: 'light' | 'dark';
  /** Render only the mark, no wordmark. */
  markOnly?: boolean;
  /** Wrap the mark in a white "app-icon" chip so it stays crisp on colored backgrounds. */
  chip?: boolean;
  className?: string;
  markClassName?: string;
  style?: CSSProperties;
}

export function FunlaneLogo({
  tone = 'dark',
  markOnly = false,
  chip = false,
  className = '',
  markClassName = 'w-9 h-9',
  style,
}: FunlaneLogoProps) {
  const nameColor = tone === 'light' ? 'text-white' : 'text-ink';
  const subColor = tone === 'light' ? 'text-white/55' : 'text-ink-3';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} style={style}>
      {chip ? (
        <span className="inline-flex items-center justify-center rounded-xl bg-card p-1.5 shadow-sm">
          <FunlaneMark className={markClassName} />
        </span>
      ) : (
        <FunlaneMark className={markClassName} />
      )}
      {!markOnly && (
        <span className="leading-tight">
          <span className={`block font-semibold text-[15px] tracking-tight ${nameColor}`}>Funlane</span>
          <span className={`block text-[10px] font-medium uppercase tracking-wider ${subColor}`}>
            Travels &amp; Logistics
          </span>
        </span>
      )}
    </span>
  );
}
