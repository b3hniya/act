/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        controller: '#3B82F6',
        command: '#22C55E',
        query: '#A855F7',
        event: '#F97316',
        handler: '#14B8A6',
      },
    },
  },
  plugins: [],
};
