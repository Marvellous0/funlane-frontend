/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'serif'],
        mono: ['"Plus Jakarta Sans"', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#1670B5',
          dark: '#0F5390',
          soft: '#E4F1FB',
        },
        luxury: {
          gold: '#C5A059',
          gold_soft: '#F4EFE6',
          navy: '#05162E',
          cream: '#FCFAF7',
        },
        ink: {
          DEFAULT: '#0F172A',
          2: '#334155',
          3: '#64748B',
        },
        navy: {
          DEFAULT: '#05162E',
          light: '#0A1A2F',
        },
        surface: '#F8FAFC',
        line: '#E2E8F0',
        green: {
          DEFAULT: '#10B981',
          dark: '#059669',
          soft: '#ECFDF5',
        },
        red: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          soft: '#FEF2F2',
        },
        purple: {
          DEFAULT: '#7c3aed',
          soft: '#ede9fe',
        },
        amber: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          soft: '#FEF3C7',
        },
        blue: {
          DEFAULT: '#0369A1',
          dark: '#075985',
          soft: '#E0F2FE',
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
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-green': 'pulse-green 2s infinite',
        'toast-progress': 'toast-progress 5s linear forwards',
        'bounce-subtle': 'bounce-subtle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
