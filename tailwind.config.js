/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts,pug}",
    "./layouts/**/*.{js,vue,ts,pug}",
    "./pages/**/*.{js,vue,ts,pug}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        lg: '1.5rem',
      },
      // sm：滿版、md：576px、lg：1024px
      screens: {
        sm: '100%',
        md: '876px',
        lg: '1024px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')]
}

