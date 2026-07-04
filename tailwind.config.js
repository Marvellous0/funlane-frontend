/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/containers/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'serif'],
        mono: ['"Plus Jakarta Sans"', 'monospace'],
      },
      colors: {
        // Themed tokens are backed by CSS variables (channels) so they flip
        // under `.dark` and still support `/opacity` modifiers. See globals.css.
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        luxury: {
          gold: '#C5A059',
          gold_soft: '#F4EFE6',
          navy: '#05162E',
          cream: '#FCFAF7',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
          3: 'rgb(var(--ink-3) / <alpha-value>)',
        },
        navy: {
          DEFAULT: '#05162E',
          light: '#0A1A2F',
        },
        // Page background, raised card surface, and hairline borders.
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        green: {
          DEFAULT: 'rgb(var(--green) / <alpha-value>)',
          dark: 'rgb(var(--green-dark) / <alpha-value>)',
          soft: 'rgb(var(--green-soft) / <alpha-value>)',
        },
        red: {
          DEFAULT: 'rgb(var(--red) / <alpha-value>)',
          dark: 'rgb(var(--red-dark) / <alpha-value>)',
          soft: 'rgb(var(--red-soft) / <alpha-value>)',
        },
        purple: {
          DEFAULT: 'rgb(var(--purple) / <alpha-value>)',
          soft: 'rgb(var(--purple-soft) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--amber) / <alpha-value>)',
          dark: 'rgb(var(--amber-dark) / <alpha-value>)',
          soft: 'rgb(var(--amber-soft) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'rgb(var(--blue) / <alpha-value>)',
          dark: 'rgb(var(--blue-dark) / <alpha-value>)',
          soft: 'rgb(var(--blue-soft) / <alpha-value>)',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.05)',
        lg: '0 12px 40px rgba(15,23,42,.16)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,.35)' },
          '50%': { boxShadow: '0 0 0 6px rgba(16,185,129,0)' },
        },
        'toast-progress': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.12)' },
          '66%': { transform: 'translate(-30px, 25px) scale(0.92)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-green': 'pulse-green 2s infinite',
        'toast-progress': 'toast-progress 5s linear forwards',
        'bounce-subtle': 'bounce-subtle 1.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 10s ease infinite',
        'spin-slow': 'spin-slow 32s linear infinite',
        'spin-slower': 'spin-slow 60s linear infinite',
        marquee: 'marquee 30s linear infinite',
        aurora: 'aurora 16s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
