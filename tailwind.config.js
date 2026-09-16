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
        cyber: {
          bg: '#0a0d14',
          card: '#121824',
          border: '#1e293b',
          neonCyan: '#00f0ff',
          neonPink: '#ff007f',
          neonYellow: '#ffe600',
          neonGreen: '#39ff14',
          neonPurple: '#a855f7',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
      },
      animation: {
        'bounce-gentle': 'bounceGentle 1.8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        'critter-float': 'critterFloat 3s ease-in-out infinite',
        'wobble-happy': 'wobbleHappy 0.6s ease-in-out infinite',
        'sleep-drift': 'sleepDrift 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.2s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 16px rgba(0, 240, 255, 0.9))' },
        },
        critterFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-4px) rotate(-1deg)' },
          '75%': { transform: 'translateY(4px) rotate(1deg)' },
        },
        wobbleHappy: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.08, 0.92) rotate(-3deg)' },
          '75%': { transform: 'scale(0.95, 1.05) rotate(3deg)' },
        },
        sleepDrift: {
          '0%': { transform: 'translate(0, 0) scale(0.6)', opacity: '0' },
          '50%': { opacity: '0.9' },
          '100%': { transform: 'translate(14px, -24px) scale(1.1)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.5) rotate(0deg)', opacity: '0.2' },
          '50%': { transform: 'scale(1.2) rotate(45deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
