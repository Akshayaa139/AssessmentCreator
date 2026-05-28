import type { Config } from "tailwindcss";

const config: Config = {
  // Disable future features that generate lab() colors
  future: {
    respectDefaultRingColorOpacity: true,
  },
  // Configure colors to avoid lab() generation
  theme: {
    extend: {
      colors: {
        // Override with standard RGB/hex to avoid lab() parsing issues with html2canvas
      },
    },
  },
};

export default config;
