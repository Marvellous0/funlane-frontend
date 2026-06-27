'use client';

import type { ElementType, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Loader } from './Spinner';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  /** Column header label. */
  header: ReactNode;
  /** Cell renderer for a row. */
  cell: (row: T) => ReactNode;
  /** Horizontal alignment. Defaults to left. */
  align?: 'left' | 'right' | 'center';
  /** Extra classes for the <th>. */
  thClassName?: string;
  /** Extra classes for the <td>. */
  tdClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Min table width before horizontal scroll kicks in (px). */
  minWidth?: number;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;

  /* Built-in states (only used when `card` is true) */
  loading?: boolean;
  loadingLabel?: string;
  error?: string | null;
  onRetry?: () => void;
  emptyIcon?: ElementType;
  empty?: ReactNode;

  /** Wrap the table in the standard white card and render loading/error/empty
   *  states inside it. Defaults to true. Pass false for a bare table. */
  card?: boolean;
  className?: string;
}

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;
const TH_BASE = 'px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide whitespace-nowrap';

/**
 * Generic, typed table. Define columns once and pass rows — the shared markup,
 * header styling, hover rows and horizontal scroll come for free, so individual
 * pages stop re-implementing `<table>` boilerplate.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  minWidth = 640,
  onRowClick,
  rowClassName,
  loading,
  loadingLabel = 'Loading…',
  error,
  onRetry,
  emptyIcon,
  empty,
  card = true,
  className = '',
}: DataTableProps<T>) {
  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line bg-surface">
            {columns.map((col, i) => (
              <th key={i} className={`${TH_BASE} ${ALIGN[col.align ?? 'left']} ${col.thClassName ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`hover:bg-surface/60 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(row) ?? ''}`}
            >
              {columns.map((col, i) => (
                <td key={i} className={`px-5 py-4 ${ALIGN[col.align ?? 'left']} ${col.tdClassName ?? ''}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!card) return table;

  let body: ReactNode;
  if (error) {
    body = (
      <div className="p-10 text-center">
        <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
        <p className="text-sm text-ink-2">{error}</p>
        {onRetry && (
          <Button variant="ghost" color="ink" leftIcon={RefreshCw} onClick={onRetry} className="mt-4 mx-auto">
            Try again
          </Button>
        )}
      </div>
    );
  } else if (loading) {
    body = <Loader label={loadingLabel} />;
  } else if (data.length === 0) {
    body = empty ? <EmptyState icon={emptyIcon}>{empty}</EmptyState> : <EmptyState icon={emptyIcon}>Nothing to show yet.</EmptyState>;
  } else {
    body = table;
  }

  return <div className={`bg-white rounded-2xl border border-line shadow-card overflow-hidden ${className}`}>{body}</div>;
}
