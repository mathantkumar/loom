/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        sentinel: {
          dark: '#0A0F11', // Deep graphite/black foundation
          100: '#F0F4F5', // Off-white/slate tint (Secondary)
          200: '#D9E2E5',
          300: '#B0C4C9',
          400: '#87A6AD',
          500: '#006B7D', // Muted Teal/Emerald (Accent)
          600: '#004D5A', // Brand Primary (Deep Intelligence Green)
          700: '#003640',
          800: '#002228',
          900: '#001418',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
