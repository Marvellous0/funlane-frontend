import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { Spinner } from './Spinner';

export type ButtonColor = 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'ink';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** color → classes for each variant. Pulls straight from the Tailwind tokens. */
const STYLES: Record<ButtonColor, Record<ButtonVariant, string>> = {
  brand: {
    solid: 'bg-brand text-white hover:bg-brand-dark',
    outline: 'border border-brand text-brand hover:bg-brand-soft',
    ghost: 'text-brand hover:bg-brand-soft',
  },
  green: {
    solid: 'bg-green text-white hover:bg-green-dark',
    outline: 'border border-green text-green-dark hover:bg-green-soft',
    ghost: 'text-green-dark hover:bg-green-soft',
  },
  red: {
    solid: 'bg-red text-white hover:bg-red-dark',
    outline: 'border border-red text-red-dark hover:bg-red-soft',
    ghost: 'text-red-dark hover:bg-red-soft',
  },
  amber: {
    solid: 'bg-amber text-white hover:bg-amber-dark',
    outline: 'border border-amber text-amber-dark hover:bg-amber-soft',
    ghost: 'text-amber-dark hover:bg-amber-soft',
  },
  blue: {
    solid: 'bg-blue text-white hover:bg-blue-dark',
    outline: 'border border-blue text-blue hover:bg-blue-soft',
    ghost: 'text-blue hover:bg-blue-soft',
  },
  ink: {
    solid: 'bg-ink text-card hover:bg-ink-2',
    outline: 'border border-line text-ink hover:bg-surface',
    ghost: 'text-ink-2 hover:bg-surface',
  },
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  leftIcon?: ElementType;
  rightIcon?: ElementType;
  children?: ReactNode;
}

/**
 * Reusable button. Pass `color` + `variant` (the "type") to compose any look —
 * e.g. `<Button color="green">Yes</Button>`, `<Button color="red" variant="outline">Cancel</Button>`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    color = 'brand',
    size = 'md',
    loading = false,
    block = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    disabled,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        SIZES[size]
      } ${STYLES[color][variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        LeftIcon && <LeftIcon aria-hidden="true" className="w-4 h-4" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon aria-hidden="true" className="w-4 h-4" />}
    </button>
  );
});
