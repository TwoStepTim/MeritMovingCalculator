import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    // library mode for the embeddable file
    lib: {
      entry: './src/mount.js',
      name: 'MeritCalc',
      formats: ['iife'],
      fileName: () => 'move-calculator.js'
    },
    rollupOptions: { treeshake: true }
  }
});
