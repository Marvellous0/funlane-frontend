'use client';

import type { ElementType, ReactNode } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { Skeleton } from './Skeleton';

type IconTone = 'brand' | 'green' | 'amber' | 'purple' | 'blue' | 'ink';

const TONE: Record<IconTone, { chip: string; spark: string }> = {
  brand: { chip: 'bg-brand-soft text-brand', spark: '#1670B5' },
  green: { chip: 'bg-green-soft text-green-dark', spark: '#059669' },
  amber: { chip: 'bg-amber-soft text-amber-dark', spark: '#B45309' },
  purple: { chip: 'bg-purple-soft text-purple', spark: '#7c3aed' },
  blue: { chip: 'bg-blue-soft text-blue', spark: '#0369A1' },
  ink: { chip: 'bg-surface text-ink-2 border border-line', spark: '#64748B' },
};

interface Trend {
  value: number;
  label?: string;
  goodWhenUp?: boolean;
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ElementType;
  iconTone?: IconTone;
  trend?: Trend;
  sparkline?: number[];
  highlight?: boolean;
  loading?: boolean;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconTone = 'brand',
  trend,
  sparkline,
  highlight = false,
  loading = false,
  href,
  className = '',
}: StatCardProps) {
  const tone = TONE[iconTone];

  const shell =
    `relative bg-card p-4 sm:p-5 rounded-2xl border shadow-card transition-all ${
      highlight ? 'border-brand/40 ring-1 ring-brand/10' : 'border-line'
    } ${href ? 'hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : ''} ${className}`;

  const inner = loading ? (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8" rounded="rounded-lg" />
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="w-24 h-7" />
      <Skeleton className="w-28 h-3" />
    </div>
  ) : (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${tone.chip}`}>
              <Icon aria-hidden="true" className="w-4 h-4" />
            </span>
          )}
          <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-wide truncate">{label}</span>
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} stroke={tone.spark} className="shrink-0 opacity-90" />
        )}
      </div>

      <div className="mt-2.5 text-2xl font-bold text-ink tabular-nums">{value}</div>

      {trend && <TrendChip {...trend} />}
    </>
  );

  if (href && !loading) {
    return (
      <Link href={href} className={shell}>
        {inner}
      </Link>
    );
  }
  return <div className={shell}>{inner}</div>;
}

function TrendChip({ value, label, goodWhenUp = true }: Trend) {
  const up = value > 0;
  const down = value < 0;
  const isGood = value === 0 ? null : (up && goodWhenUp) || (down && !goodWhenUp);

  const tone =
    isGood === null
      ? 'bg-surface text-ink-3 border border-line'
      : isGood
        ? 'bg-green-soft text-green-dark'
        : 'bg-red-soft text-red-dark';

  const Arrow = up ? TrendingUp : down ? TrendingDown : Minus;

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${tone}`}>
        <Arrow aria-hidden="true" className="w-3 h-3" />
        {value > 0 ? '+' : ''}
        {value}%
      </span>
      {label && <span className="text-[11px] text-ink-3 truncate">{label}</span>}
    </div>
  );
}
