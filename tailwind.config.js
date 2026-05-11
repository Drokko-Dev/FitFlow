/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        bg3:     'var(--bg3)',
        card:    'var(--card)',
        card2:   'var(--card2)',
        border:  'rgb(var(--border) / <alpha-value>)',
        accent:  'rgb(var(--accent) / <alpha-value>)',
        accent2: '#a855f7',
        green:   '#22d3a0',
        yellow:  '#f59e0b',
        red:     '#ef4444',
        muted:   'var(--muted)',
      },
      fontFamily: {
        display:  ['Syne', 'sans-serif'],
        body:     ['DM Sans', 'sans-serif'],
        heading:  ['Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.7)' },
        },
        checkPop: {
          '0%':   { transform: 'scale(1)' },
          '45%':  { transform: 'scale(1.22)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'check-pop':  'checkPop 260ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'fade-in':    'fadeIn 220ms ease-out forwards',
        'slide-up':   'slideUp 300ms cubic-bezier(0.34,1.2,0.64,1) forwards',
      },
    },
  },
  plugins: [],
}
