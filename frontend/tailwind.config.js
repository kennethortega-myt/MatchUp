/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#C9A84C',   // champagne gold
        secondary: '#7C3AED',   // deep violet
        gold:      '#C9A84C',
        'gold-light': '#E0C070',
        'gold-deep':  '#A07830',
        obsidian:  '#070509',
        surface:   '#0F0C18',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold':     '0 0 24px 0 rgba(201,168,76,0.18)',
        'gold-lg':  '0 8px 40px 0 rgba(201,168,76,0.22)',
        'card':     '0 2px 16px 0 rgba(0,0,0,0.3)',
        'card-hover':'0 8px 32px 0 rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E0C070 0%, #C9A84C 50%, #A07830 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0F0C18 0%, #070509 100%)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
