/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0B0F17',
          800: '#111622',
          700: '#1B2234',
          600: '#26304A',
        },
        accent: {
          primary: '#6366F1', // Indigo
          secondary: '#8B5CF6', // Violet
          glow: '#3B82F6', // Blue
        }
      },
      keyframes: {
        typing: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        typing: 'typing 1s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
