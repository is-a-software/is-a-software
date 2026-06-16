/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-950': '#020617',
        'dark-900': '#0f172a',
      },
      backgroundColor: {
        'glass-light': 'rgb(30 41 59 / 0.8)',
      },
      borderColor: {
        'glass': 'rgb(255 255 255 / 0.1)',
      },
    },
  },
  plugins: [],
};
