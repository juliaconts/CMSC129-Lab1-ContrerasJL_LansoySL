// tailwind.config.cjs or tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", 
    "./frontend/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
        "light", 
        "dark",
        {
            elekcoded: {
                "primary": "#4070F4",
                "secondary": "#f34700",
                "accent": "#37CDBE",
                "neutral": "#3D4451",
                "base-100": "#FFFFFF",
                "info": "#2094F3",
                "success": "#009485",
                "warning": "#FF9900",
                "error": "#FF5724",
            }
        }
    ],
  }
};
