/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      screens: { xs: '475px' },
      fontFamily: {
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        wave: {
          '0%,60%,100%': { transform: 'rotate(0)' },
          '10%,30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'none' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        wave: 'wave 2.5s infinite',
        fade: 'fadeIn .35s ease-out',
      },
    },
  },
  plugins: [],
};
