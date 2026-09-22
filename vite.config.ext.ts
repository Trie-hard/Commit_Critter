import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'extension-manifest-and-assets',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist-ext');
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }

        // Copy manifest.ext.json -> dist-ext/manifest.json
        const manifestSrc = resolve(__dirname, 'manifest.ext.json');
        const manifestDest = resolve(outDir, 'manifest.json');
        fs.copyFileSync(manifestSrc, manifestDest);
        console.log('✔ Copied manifest.ext.json to dist-ext/manifest.json');

        // Copy overlay.css -> dist-ext/overlay.css
        const overlaySrc = resolve(__dirname, 'src/content/overlay.css');
        const overlayDest = resolve(outDir, 'overlay.css');
        if (fs.existsSync(overlaySrc)) {
          fs.copyFileSync(overlaySrc, overlayDest);
          console.log('✔ Copied src/content/overlay.css to dist-ext/overlay.css');
        }

        // Copy icons directory to dist-ext/icons
        const iconsSrc = resolve(__dirname, 'public/icons');
        const iconsDest = resolve(outDir, 'icons');
        if (fs.existsSync(iconsSrc)) {
          fs.cpSync(iconsSrc, iconsDest, { recursive: true });
          console.log('✔ Copied public/icons to dist-ext/icons');
        }
      },
    },
  ],
  base: './',
  build: {
    outDir: 'dist-ext',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        index: resolve(__dirname, 'index.html'),
        serviceWorker: resolve(__dirname, 'src/background/serviceWorker.ts'),
        githubOverlay: resolve(__dirname, 'src/content/githubOverlay.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'serviceWorker') return 'serviceWorker.js';
          if (chunkInfo.name === 'githubOverlay') return 'githubOverlay.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            if (assetInfo.name.includes('overlay')) return 'overlay.css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});
