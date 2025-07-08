/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'digi-blue': '#00d4ff',
        'digi-orange': '#ff6600',
        'digi-purple': '#9333ea',
        'digi-green': '#10b981',
        'digi-dark': '#0c0c0c',
        'digi-gray': '#1a1a1a',
        'cyber-cyan': '#00ffff',
        'cyber-teal': '#00d4ff',
        'cyber-orange': '#ff6600',
      },
      fontFamily: {
        'digi': ['Orbitron', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'crack': 'crack 3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00a8ff' },
          '100%': { boxShadow: '0 0 20px #00a8ff, 0 0 30px #00a8ff' },
        },
        crack: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}