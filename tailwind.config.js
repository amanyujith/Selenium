const plugin = require("tailwindcss/plugin")

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: "var(--theme-primary)",
      "primary-light": "var(--theme-primary-light)",
      "primary-100": "var(--theme-primary-100)",
      "primary-200": "var(--theme-primary-200)",
      "primary-500": "var(--theme-primary-500)",
      "primary-alpha-20": "var(--theme-primary-alpha-20)",
      secondary: "var(--theme-secondary)",
      main: "var(--theme-main)",
      link: "var(--theme-link)",
      danger: "var(--theme-danger)",
      status: "var(--theme-status)",
      notification: "var(--theme-notification)",
      accent: "var(--theme-accent)",
      "secondary-light": "var(--theme-secondary-light)",
      "text-base": "var(--theme-text-base)",
    },
    extend: {
      animation: {
        bounce: "bounce 1s infinite",
        marquee: "marquee 10s linear infinite",
        marquee2: "marquee2 10s linear infinite",
        round: "round 200ms ",
        round2: "round 350ms ",
        translateX: "translateX 100ms",
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        round: {
          "0%": {
            // borderRadius: "50%",
            backgroundColor: "#c1c1c1",
          },
          // "40%": { borderRadius: "40%" },
          "50%": {
            // borderRadius: "30%",
            backgroundColor: "#c1c1c1",
          },
          "100%": {
            // borderRadius: "20%",
            backgroundColor: "#c1c1c1",
          },
        },
        translateX: {
          "0%": {
            opacity: 0,
            transform: "translateX(-60px)",
          },
          // "40%": {
          //   transform: "translateX(-40px)",
          // },
          // "50%": {
          //   transform: "translateX(-20px)",
          // },
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "Open Sans"],
        opensans: ["Open Sans"],
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1403px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    groups: ["mention", "files", "date-picker"],
  },
  fontFamily: {
    roboto: ["Roboto", "sans-serif"],
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [
    plugin(({ addVariant, theme }) => {
      const groups = theme("groups") || []

      groups.forEach((group) => {
        addVariant(`group-${group}-hover`, () => {
          return `:merge(.group-${group}):hover &`
        })
      })
    }),
  ],
}
