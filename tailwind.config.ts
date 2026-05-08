import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fafc",
          500: "#334155",
          700: "#1e293b"
        }
      }
    }
  },
  plugins: []
};

export default config;
