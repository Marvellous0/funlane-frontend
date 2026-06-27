'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Delay before the reveal animation, in ms. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}

const HIDDEN: Record<NonNullable<RevealProps['from']>, string> = {
  up: 'opacity-0 translate-y-10',
  down: 'opacity-0 -translate-y-10',
  left: 'opacity-0 translate-x-10',
  right: 'opacity-0 -translate-x-10',
  scale: 'opacity-0 scale-95',
};

/**
 * Scroll-triggered reveal. Wraps content and fades/slides it into view the
 * first time it enters the viewport — no animation library required.
 */
export function Reveal({ children, delay = 0, from = 'up', className = '', as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect users who prefer reduced motion — show immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${shown ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : HIDDEN[from]} ${className}`}
    >
      {children}
    </Tag>
  );
}
