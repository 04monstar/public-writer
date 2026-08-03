import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Storybound — The Luxury Reading Room',
    favicon: './public/favicon.svg',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
});
