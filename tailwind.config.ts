import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // KOCHUVILA OFFICIAL BRAND COLOR SYSTEM
          primary: "#0096F4",         // Primary Brand Blue (CTA buttons, active nav, highlights)
          primaryHover: "#017ED0",    // Deep Blue on hover
          deepBlue: "#017ED0",        // Deep Blue (header accents, footer, strong promos)
          deepBlueHover: "#006cb5",
          lightBlue: "#9FD9F1",       // Light Blue (soft backgrounds, cards, subtle UI)
          lightBlueSoft: "#EBF7FC",   // Very soft light blue tint
          neutralGrey: "#F5F7F9",     // Neutral Light Grey (page backgrounds, dividers)
          black: "#000000",           // Black (headings, product names, important text)
          white: "#FFFFFF",           // White (clean product cards, spacious layouts)
          border: "#E5E9EE",          // Subtle border grey
          borderHover: "#9FD9F1",     // Light blue hover border

          // Aliases to ensure 100% component compatibility
          accent: "#0096F4",
          accentHover: "#017ED0",
          sky: "#9FD9F1",
          skyLight: "#9FD9F1",
          skySoft: "#EBF7FC",
          dark: "#000000",
          slate: "#334155",
          muted: "#64748b",
          surface: "#FFFFFF",
          surfaceSubtle: "#F5F7F9",
          burgundy: "#0096F4",
          burgundyHover: "#017ED0",
          burgundyLight: "#EBF7FC",
          charcoal: "#000000",
          warmWhite: "#FFFFFF",
          warmBeige: "#F5F7F9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        cardHover: "0 12px 28px -4px rgba(0, 150, 244, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        elevated: "0 20px 40px -10px rgba(1, 126, 208, 0.12)",
        button: "0 3px 12px rgba(0, 150, 244, 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
