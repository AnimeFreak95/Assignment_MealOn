/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tangerine: {
          DEFAULT: '#FF5A1F',
          50: '#FFF5F0',
          100: '#FFE6DC',
          200: '#FFCEB9',
          500: '#FF5A1F',
          600: '#E04812',
          700: '#B8350B',
        },
        brandEmerald: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          dark: '#064E3B',
        },
        brandAmber: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        alabaster: '#F8FAFC',
        slateDark: '#0F172A',
        phoneBorder: '#1E293B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'phone': '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'soft': '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)',
        'glow-tangerine': '0 0 20px -3px rgba(255, 90, 31, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
}
