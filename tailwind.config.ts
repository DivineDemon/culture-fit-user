/** @type {import('tailwindcss').Config} */

export default {
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeDots: {
          "0%": { opacity: "0.2", transform: "scale(0.1)" },
          "60%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "0.2", transform: "scale(0.1)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeDots: "fadeDots .8s infinite",
        marquee: "marquee 12s linear infinite",
        fadein: "fadein 0.5s ease",
      },
    },
  },
};
