/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: "fade 0.5s ease-in-out",
        slideIn: "slideIn 0.5s ease-out",
    },
    keyframes: {
        fade: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
      },
    },
    },
  },
  plugins: [],
}

