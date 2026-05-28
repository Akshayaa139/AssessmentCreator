const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Disable modern color space features to avoid lab() which html2canvas can't parse
      future: {
        disableLegacyFallbacks: true,
      },
    },
  },
};

export default config;
