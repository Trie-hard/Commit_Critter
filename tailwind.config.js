/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Steep Design System Palette
        ink: {
          DEFAULT: '#17191c',
          black:   '#17191c',
        },
        paper: {
          DEFAULT: '#ffffff',
          white:   '#ffffff',
        },
        mist: {
          DEFAULT: '#f2f2f3',
          gray:    '#f2f2f3',
        },
        fog: {
          DEFAULT: '#fafafb',
          white:   '#fafafb',
        },
        slate: {
          DEFAULT: '#777b86',
          gray:    '#777b86',
        },
        ash: {
          DEFAULT: '#979799',
          gray:    '#979799',
        },
        smoke: {
          DEFAULT: '#a3a6af',
          gray:    '#a3a6af',
        },
        peach: {
          DEFAULT: '#fbe1d1',
          blush:   '#fbe1d1',
        },
        sienna: {
          DEFAULT: '#5d2a1a',
          brown:   '#5d2a1a',
        },
        // Shell theme colors
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
        serif:   ['"Newsreader"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        pixel:   ['"Press Start 2P"', 'monospace'],
        vt:      ['"VT323"', 'monospace'],
      },
      borderRadius: {
        'cards':        '24px',
        'inputs':       '16px',
        'elevated':     '20px',
        'pill':         '9999px',
        '3xl':          '24px',
        '4xl':          '32px',
      },
      boxShadow: {
        'subtle':   '0 0 0 1px rgba(0,0,0,0.05), 0 4px 20px 0 rgba(0,0,0,0.03)',
        'artifact': '0 0 0 1px rgba(4,23,43,0.05), 0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03)',
        'modal':    '0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px 0 rgba(0,0,0,0.12)',
        'device':   '0 0 0 1px rgba(0,0,0,0.06), 0 20px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
      },
      animation: {
        'critter-float': 'critterFloat 3s ease-in-out infinite',
        'wobble-happy':  'wobbleHappy 0.6s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1.8s ease-in-out infinite',
        'sleep-drift':   'sleepDrift 2s ease-in-out infinite',
        'sparkle':       'sparkle 1.2s ease-in-out infinite',
        'fade-in':       'fadeIn 0.35s ease-out forwards',
        'slide-up':      'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ticker-scroll': 'tickerScroll 36s linear infinite',
      },
      keyframes: {
        critterFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%':      { transform: 'translateY(-4px) rotate(-1deg)' },
          '75%':      { transform: 'translateY(4px) rotate(1deg)' },
        },
        wobbleHappy: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%':      { transform: 'scale(1.05, 0.95) rotate(-2deg)' },
          '75%':      { transform: 'scale(0.96, 1.04) rotate(2deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-5px)' },
        },
        sleepDrift: {
          '0%':   { transform: 'translate(0, 0) scale(0.6)', opacity: '0' },
          '50%':  { opacity: '0.8' },
          '100%': { transform: 'translate(10px, -18px) scale(1.1)', opacity: '0' },
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
        tickerScroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
