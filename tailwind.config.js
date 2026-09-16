/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Warm dark palette ──
        ink: {
          950: '#0a0806',
          900: '#120f0c',
          800: '#1a1612',
          700: '#221d18',
          600: '#2d271f',
          500: '#3d3428',
          400: '#5a5044',
          300: '#7d7065',
          200: '#a89a8e',
          100: '#cfc3b8',
          50:  '#f0e6da',
        },
        // ── Orange accent (primary) ──
        ember: {
          DEFAULT: '#e8733a',
          light:   '#f09060',
          dim:     '#1c0e06',
          muted:   '#6b3318',
        },
        // ── Sage green (vitals) ──
        sage: {
          DEFAULT: '#5a9e72',
          light:   '#7dba93',
          dim:     '#0a1a10',
          muted:   '#234d30',
        },
        // ── Sky blue (links / info) ──
        sky: {
          DEFAULT: '#4a90b8',
          light:   '#72aecf',
          dim:     '#071523',
          muted:   '#1c3f58',
        },
        // ── Gameboy palette (kept for shell) ──
        gameboy: {
          lightest: '#9bbc0f',
          light:    '#8bac0f',
          dark:     '#306230',
          darkest:  '#0f380f',
          screen:   '#8fae1b',
          shell:    '#c8c6be',
          shellDark:'#b2b0a6',
          bezel:    '#595d66',
          magenta:  '#9e2261',
        },
      },
      fontFamily: {
        display: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        pixel:   ['"Press Start 2P"', 'monospace'],
        vt:      ['"VT323"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'card-lg': '0 2px 8px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)',
        'inset-t': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        'device':  '0 24px 80px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)',
      },
      animation: {
        'critter-float': 'critterFloat 3s ease-in-out infinite',
        'wobble-happy':  'wobbleHappy 0.6s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1.8s ease-in-out infinite',
        'sleep-drift':   'sleepDrift 2s ease-in-out infinite',
        'sparkle':       'sparkle 1.2s ease-in-out infinite',
        'fade-in':       'fadeIn 0.4s ease-out forwards',
        'slide-up':      'slideUp 0.5s ease-out forwards',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'ticker-scroll': 'tickerScroll 30s linear infinite',
      },
      keyframes: {
        critterFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%':      { transform: 'translateY(-5px) rotate(-1deg)' },
          '75%':      { transform: 'translateY(4px) rotate(1deg)' },
        },
        wobbleHappy: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%':      { transform: 'scale(1.06, 0.94) rotate(-2deg)' },
          '75%':      { transform: 'scale(0.96, 1.04) rotate(2deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        sleepDrift: {
          '0%':   { transform: 'translate(0, 0) scale(0.6)', opacity: '0' },
          '50%':  { opacity: '0.8' },
          '100%': { transform: 'translate(12px, -20px) scale(1.1)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.5) rotate(0deg)', opacity: '0.2' },
          '50%':      { transform: 'scale(1.2) rotate(45deg)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        tickerScroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
