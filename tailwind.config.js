/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── 3-color system ──────────────────────────────
        // dark-blue accent
        accent: {
          DEFAULT: '#1E3A5F',   // main accent
          light:   '#2A5298',   // lighter shade for hover/glow
          muted:   '#1E3A5F99', // semi-transparent
        },
        // dark backgrounds
        dark: {
          950: '#0A0A0A',
          900: '#0F0F0F',
          800: '#141414',
          700: '#1A1A1A',
          600: '#202020',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        float:       'float 6s ease-in-out infinite',
        'pulse-glow':'pulseGlow 3s ease-in-out infinite',
        blink:       'blink 1s step-end infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in-up':'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px #1E3A5F55, 0 0 40px #1E3A5F22' },
          '50%':     { boxShadow: '0 0 40px #2A529888, 0 0 60px #1E3A5F44' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
