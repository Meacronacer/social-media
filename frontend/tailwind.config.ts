import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#ae7aff",
        active: "#161616",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".scrollbar-thin": {
          useScrollbarWidth: "thin",
          scrollbarColor: "#ae7aff",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#161616",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ae7aff",
            borderRadius: "20px",
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
} satisfies Config;
