/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Legacy gameboy palette (kept for shell theming)
        gameboy: {
          lightest: '#9bbc0f',
          light: '#8bac0f',
          dark: '#306230',
          darkest: '#0f380f',
          screen: '#8fae1b',
          shell: '#c8c6be',
          shellDark: '#b2b0a6',
          bezel: '#595d66',
          magenta: '#9e2261',
        },
        // NEW: Cosmic palette (primary app aesthetic)
        cosmic: {
          void:    '#03040a',
          deep:    '#070b16',
          nebula:  '#0d1526',
          slate:   '#111d33',
          surface: '#14213d',
          rim:     '#1a2d50',
          mist:    '#7ea8d8',
          star:    '#e8f0fd',
        },
        // Legacy cyber (kept for compatibility)
        cyber: {
          bg:          '#03040a',
          card:        '#070b16',
          border:      '#1a2d50',
          neonCyan:    '#00f0ff',
          neonPink:    '#ff007f',
          neonYellow:  '#ffe600',
          neonGreen:   '#39ff14',
          neonPurple:  '#a855f7',
        },
        // NEW: Element accent palettes
        element: {
          flora:    '#22c55e',
          floraDim: '#14532d',
          volt:     '#eab308',
          voltDim:  '#422006',
          ferro:    '#f97316',
          ferroDim: '#431407',
          tidal:    '#38bdf8',
          tidalDim: '#0c2340',
          prism:    '#ec4899',
          prismDim: '#500724',
          void:     '#a78bfa',
          voidDim:  '#2e1065',
        },
      },
      fontFamily: {
        pixel:   ['"Press Start 2P"', 'monospace'],
        vt:      ['"VT323"', 'monospace'],
        mono:    ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass':      '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg':   '0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-cyan':  '0 0 20px rgba(0,240,255,0.25), 0 0 60px rgba(0,240,255,0.1)',
        'glow-flora': '0 0 20px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)',
        'glow-volt':  '0 0 20px rgba(234,179,8,0.3), 0 0 60px rgba(234,179,8,0.1)',
        'glow-ferro': '0 0 20px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.1)',
        'glow-tidal': '0 0 20px rgba(56,189,248,0.3), 0 0 60px rgba(56,189,248,0.1)',
        'glow-prism': '0 0 20px rgba(236,72,153,0.3), 0 0 60px rgba(236,72,153,0.1)',
        'glow-void':  '0 0 20px rgba(167,139,250,0.3), 0 0 60px rgba(167,139,250,0.1)',
        'orb':        '0 6px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.3)',
        'orb-press':  '0 2px 8px rgba(0,0,0,0.5), inset 0 2px 8px rgba(0,0,0,0.4)',
      },
      animation: {
        // Critter animations
        'bounce-gentle':  'bounceGentle 1.8s ease-in-out infinite',
        'pulse-glow':     'pulseGlow 2.2s ease-in-out infinite',
        'critter-float':  'critterFloat 3s ease-in-out infinite',
        'wobble-happy':   'wobbleHappy 0.6s ease-in-out infinite',
        'sleep-drift':    'sleepDrift 2s ease-in-out infinite',
        'sparkle':        'sparkle 1.2s ease-in-out infinite',
        // NEW
        'star-twinkle':   'starTwinkle 3s ease-in-out infinite',
        'orbit-spin':     'orbitSpin 12s linear infinite',
        'orbit-spin-rev': 'orbitSpin 18s linear infinite reverse',
        'ticker-scroll':  'tickerScroll 28s linear infinite',
        'ecg-draw':       'ecgDraw 2.4s ease-in-out infinite',
        'plasma-ripple':  'plasmaRipple 1.6s ease-out forwards',
        'glass-shimmer':  'glassShimmer 3s ease-in-out infinite',
        'fade-up':        'fadeUp 0.5s ease-out forwards',
        'halo-pulse':     'haloPulse 3s ease-in-out infinite',
        'ambient-drift':  'ambientDrift 8s ease-in-out infinite alternate',
      },
      keyframes: {
        // Legacy critter anims
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' },
          '50%':      { opacity: '0.85', filter: 'drop-shadow(0 0 16px rgba(0,240,255,0.9))' },
        },
        critterFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%':      { transform: 'translateY(-4px) rotate(-1deg)' },
          '75%':      { transform: 'translateY(4px) rotate(1deg)' },
        },
        wobbleHappy: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%':      { transform: 'scale(1.08, 0.92) rotate(-3deg)' },
          '75%':      { transform: 'scale(0.95, 1.05) rotate(3deg)' },
        },
        sleepDrift: {
          '0%':   { transform: 'translate(0, 0) scale(0.6)', opacity: '0' },
          '50%':  { opacity: '0.9' },
          '100%': { transform: 'translate(14px, -24px) scale(1.1)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.5) rotate(0deg)', opacity: '0.2' },
          '50%':      { transform: 'scale(1.2) rotate(45deg)', opacity: '1' },
        },
        // NEW
        starTwinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%':      { opacity: '1', transform: 'scale(1.2)' },
        },
        orbitSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        tickerScroll: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ecgDraw: {
          '0%':   { strokeDashoffset: '600' },
          '60%':  { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '0' },
        },
        plasmaRipple: {
          '0%':   { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        glassShimmer: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%':      { backgroundPosition: '-200% center' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        haloPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%':      { transform: 'scale(1.06)', opacity: '0.7' },
        },
        ambientDrift: {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(24px, -16px) scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}
