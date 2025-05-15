/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brick': '#000000',
        'brick-dark': '#333333',
        'brick-hover': '#555555',
        'sidewalk': '#F5F5F5',
        'sidewalk-dark': '#EEEEEE',
        'highlight': '#FFD700',
      },
      backgroundColor: {
        'app-light': '#FFFFFF',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} 