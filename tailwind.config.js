const classTheme = require("./src/lib/theme/class.theme");

classTheme.extend.colors.primary = "#FC9245"; // student: #FC9245 ; teacher: #3d9cf3

/**@type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: classTheme,
  variants: {
    extend: {},
  },
  plugins: [],
};
