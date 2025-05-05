module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          'est-blue': '#1e3a8a',
          'est-light-blue': '#3b82f6',
          'est-yellow': '#f59e0b',
        },
        fontFamily: {
          sans: ['Roboto', 'sans-serif'],
        },
      }
    },
    plugins: [],
  }