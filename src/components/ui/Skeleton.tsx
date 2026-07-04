'use client';

export function Skeleton({ className = 'h-4 w-full', rounded = 'rounded-md' }: { className?: string; rounded?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-[shimmer_1.4s_linear_infinite] bg-[length:200%_100%] ${rounded} ${className}`}
      style={{ backgroundImage: 'linear-gradient(90deg,rgb(var(--skeleton-base)) 25%,rgb(var(--skeleton-highlight)) 50%,rgb(var(--skeleton-base)) 75%)' }}
    />
  );
}
