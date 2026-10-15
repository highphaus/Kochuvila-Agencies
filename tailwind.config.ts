import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // KOCHUVILA OFFICIAL BRAND PALETTE (From logo palette image)
          primary: "#0097F3",         // 0097f3 - Electric Brand Blue (CTA buttons, active nav, highlights)
          primaryHover: "#017ED0",    // 017ed0 - Deep Blue on hover
          deepBlue: "#017ED0",        // 017ed0 - Deep Royal Blue (header accents, footer, headers)
          deepBlueHover: "#006bb0",   // Darker royal blue
          lightBlue: "#9FD8F1",       // 9fd8f1 - Sky Blue (soft backgrounds, borders, pill badges)
          lightBlueSoft: "#EBF6FC",   // Light sky soft tint
          background: "#FDFDFD",      // fdfdfd - Clean page background
          white: "#FFFFFF",           // Pure White
          black: "#000000",           // Pitch Black (from logo mark)
          dark: "#0F172A",            // Slate Dark for body text
          muted: "#64748B",           // Muted text
          border: "#E2EBF2",          // Subtle border
          borderHover: "#9FD8F1",     // Border hover in 9fd8f1
          footerDark: "#0A192F",      // Deep Navy Footer

          // Theme color tokens
          accent: "#0097F3",
          accentHover: "#017ED0",
          sky: "#9FD8F1",
          skyLight: "#9FD8F1",
          skySoft: "#EBF6FC",
          neutralGrey: "#F8FAFC",
          sectionBg: "#F0F8FD",
          textDark: "#0F172A",
          textMuted: "#64748B",
          surface: "#FFFFFF",
          surfaceSubtle: "#FDFDFD",
          charcoal: "#000000",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        editorial: ["'Playfair Display'", "Georgia", "serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        cardHover: "0 10px 25px -3px rgba(164, 15, 28, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        elevated: "0 20px 40px -10px rgba(164, 15, 28, 0.12)",
        button: "0 3px 12px rgba(164, 15, 28, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
