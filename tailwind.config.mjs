/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary (Persian Green) — from logo
        teal: {
          50: '#F3FAF8',
          100: '#D6F1EB',
          200: '#AEE1D6',
          300: '#7DCBBE',
          400: '#52AFA2',
          500: '#3B9B8F',
          600: '#2B766E',
          700: '#265F5A',
          800: '#224D49',
          900: '#20413E',
          950: '#0E2525',
        },
        // Navy — mapped to teal family for cohesive palette
        navy: {
          50: '#F3FAF8',
          100: '#D6F1EB',
          200: '#AEE1D6',
          300: '#7DCBBE',
          400: '#52AFA2',
          500: '#3B9B8F',
          600: '#2B766E',
          700: '#265F5A',
          800: '#224D49',
          900: '#20413E',
          950: '#0E2525',
        },
        // Gold / Accent — from coin in logo
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#F5C842',
          400: '#f5b820',
          500: '#E79E07',
          600: '#ca7f04',
          700: '#a15f07',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
