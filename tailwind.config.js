/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0a0f',
        bg2:     '#12121a',
        bg3:     '#1a1a26',
        card:    '#1e1e2e',
        card2:   '#252538',
        border:  '#2a2a40',
        accent:  '#7c6aff',
        accent2: '#a855f7',
        green:   '#22d3a0',
        yellow:  '#f59e0b',
        red:     '#ef4444',
        muted:   '#8888aa',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.7)' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
