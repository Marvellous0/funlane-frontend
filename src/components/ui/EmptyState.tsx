import type { ElementType, ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';

export function EmptyState({ icon: Icon = FolderOpen, children }: { icon?: ElementType; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-8 text-center animate-fade-in">
      <Icon aria-hidden="true" className="w-10 h-10 mb-4 text-ink-3 opacity-80" strokeWidth={1.5} />
      <div className="text-sm font-medium text-ink-2 max-w-xs leading-relaxed">{children}</div>
    </div>
  );
}
